import {
  responseRESTError,
  responseREST,
  dbStatus,
  httpStatus,
} from "../../common/functions.js";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const getOrCreateStripeCustomer = async (t, organization_id, email) => {
    // Check if user already has a customer ID
    let customer = await t.oneOrNone(
      'SELECT stripe_customer_id FROM organizations WHERE id = $1',
      [organization_id]
    );

    // If no customer ID exists, create one in Stripe
    if (!customer?.stripe_customer_id) {
      const organization = await t.one(
        `SELECT o.name, email, address_line1, address_line2, city, s.name as state_name, 
                zip_code, c.name as country_name
         FROM organizations o
         JOIN states s ON s.id = o.state_id
         JOIN countries c ON c.id = o.country_id 
         WHERE o.id = $1`,
        [organization_id]
      );

      const stripeCustomer = await stripe.customers.create({
        email: organization.email,
        name: organization.name,
        address: {
          line1: organization.address_line1,
          line2: organization.address_line2,
          city: organization.city,
          state: organization.state_name,
          postal_code: organization.zip_code,
          country: organization.country_name,
        },
        metadata: {
          organization_id: organization_id
        }
      });

      // Store the customer ID
      await t.none(
      `UPDATE organizations SET stripe_customer_id = $1 WHERE id = $2`,
        [stripeCustomer.id, organization_id]
      );

      customer = { stripe_customer_id: stripeCustomer.id };
    }

    return customer.stripe_customer_id;
}

const createSubscriptionService = async (req, res) => {
  const functionName = "createSubscriptionService";
  // const tenantDb = $connectTenant(req.userInfo.email);
  
  try {
    const { price_id, mau_quantity, trial } = req.body;
    const { user_id, organization_id } = req.userInfo;

    const result = await $main.task(async (t) => {
      const priceDetails = await t.oneOrNone(
        `SELECT pp.id AS price_id, pp.reference_price_id, p.id AS package_id, 
                p.name AS package_name, p.is_trial, p.trial_days, p.maus_unit_limit, pp.price, 
                pp2.reference_price_id AS maus_reference_price_id, pp2.id AS maus_price_id, pp.interval_type_id
         FROM packages p
         INNER JOIN package_prices pp ON p.id = pp.package_id
         LEFT JOIN package_prices pp2 ON p.id = pp2.parent_package_id 
            AND pp2.interval_type_id = pp.interval_type_id
         WHERE pp.id = $1 AND pp.status = 1`,
        [price_id]
      );
      
      if (!priceDetails || !priceDetails.reference_price_id) {
        throw new Error("Invalid or inactive price ID");
      }
      
      if (!priceDetails.maus_reference_price_id) {
        throw new Error("Missing MAU price reference. Contact support.");
      }

      if (mau_quantity <= 0 || (priceDetails.maus_unit_limit && mau_quantity > priceDetails.maus_unit_limit)) {
        throw new Error("Invalid MAU quantity");
      }
      
      // Handle trial validation
      if (trial) {
        if (!priceDetails.is_trial) {
          throw new Error("This package does not support trial period");
        }
        const is_trial_used = await t.oneOrNone(
          `SELECT 1 FROM subscription_historys WHERE organization_id = $1 AND is_trial = true LIMIT 1`,
          [organization_id]
        );
        if (is_trial_used) {
          throw new Error("Trial period has already been used for this organization");
        }
      }

      // Get current subscription if exists
      const currentSubscription = await t.oneOrNone(
        `SELECT id, stripe_sub_id, status 
         FROM subscriptions 
         WHERE organization_id = $1 
         LIMIT 1`,
        [organization_id]
      );

      const stripeCustomerId = await getOrCreateStripeCustomer(t, organization_id);
      let shouldCreateNewSubscription = true;

      if (currentSubscription?.stripe_sub_id) {
        try {
          const stripeSubscription = await stripe.subscriptions.retrieve(
            currentSubscription.stripe_sub_id, 
            { expand: ['items', 'latest_invoice.payment_intent'] }
          );
          
          if (['active', 'past_due', 'trialing', 'unpaid'].includes(stripeSubscription.status)) {
            shouldCreateNewSubscription = false;

            if (stripeSubscription.latest_invoice?.status === 'open') {
              throw new Error('Please pay your pending invoice before making changes');
            }

            const items = buildSubscriptionItems(stripeSubscription, priceDetails, mau_quantity);
            if (items.length > 0) {

              const subObj = 
                {
                  items,
                  proration_behavior: 'always_invoice',
                  payment_settings: { save_default_payment_method: 'on_subscription' },
                  pending_if_incomplete: true,
                  metadata: { 
                    organization_id,
                    user_id,
                    package_id: priceDetails.package_id,
                    package_price_id: priceDetails.price_id,
                    interval_type_id: priceDetails.interval_type_id,
                    maus_price_id : priceDetails.maus_price_id,
                    mau_quantity 
                   }
                }
              
                if (stripeSubscription.status === "trialing" && !trial) {
                  subObj.trial_end = "now";
                }

              const updatedSubscription = await stripe.subscriptions.update(
                currentSubscription.stripe_sub_id,
                subObj
              );

              // Log the update
            await logPurchase(t, {
              organization_id,
              package_id: priceDetails.package_id,
              package_price_id: priceDetails.price_id,
              status: 'updated',
              session_id: updatedSubscription.id,
              user_id,
              mau_quantity,
              previous_subscription_id: currentSubscription.id
            });

              return { 
                status: 'updated', 
                subscription_id: updatedSubscription.id,
                requires_action: updatedSubscription.latest_invoice?.payment_intent?.status === 'requires_action'
              };
            } else {
              return { 
                status: 'unchanged',
              };
            }
          }
        } catch (error) {
          console.error("Error retrieving subscription: ", error.message);
          await logPurchase(t, {
            organization_id,
            package_id: priceDetails.package_id,
            package_price_id: priceDetails.price_id,
            status: 'error',
            session_id: currentSubscription.stripe_sub_id,
            user_id,
            mau_quantity,
            error_message: error.message
          });
          throw new Error(`Failed to retrieve subscription: ${error.message}`);
        }
      }

      if (shouldCreateNewSubscription) {

        const sessionObj = {
          customer: stripeCustomerId,
          line_items: [
            { price: priceDetails.reference_price_id, quantity: 1 },
            { price: priceDetails.maus_reference_price_id, quantity: mau_quantity }
          ],
          mode: 'subscription',
          success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
          payment_method_collection: 'always',
          allow_promotion_codes: true,
          billing_address_collection: 'auto',
          customer_update: { address: 'auto', shipping: 'auto' },
          metadata: { 
            organization_id, 
            user_id,
            package_id: priceDetails.package_id, 
            package_price_id: priceDetails.price_id, 
            interval_type_id: priceDetails.interval_type_id, 
            maus_price_id : priceDetails.maus_price_id,
            mau_quantity 
          }
        };
        
        if (trial && priceDetails.trial_days > 0) {
          sessionObj.subscription_data = {
            trial_period_days: priceDetails.trial_days,
            trial_settings: { end_behavior: { missing_payment_method: 'cancel' } }
          };
        }
        
        const session = await stripe.checkout.sessions.create(sessionObj);

        await logPurchase(t, {
          organization_id,
          package_id: priceDetails.package_id,
          package_price_id: priceDetails.price_id,
          status: 'pending',
          session_id: session.id,
          user_id,
          mau_quantity
        });
        return { checkout_url: session.url, session_id: session.id };
      }
    });
    return responseREST(res, httpStatus.SUCCESS, 'session created successfully', result);
  } catch (error) {
    console.error(`${functionName} Error:`, error.message);
    return responseRESTError(req, res, error);
  }
};

const changeSubscriptionStatus = async (req, res) => {
  const { organization_id } = req.userInfo;
  const { status } = req.body;

  try {
    // Get the organization's subscription from the database
    const subscription = await $main.oneOrNone(
      'SELECT stripe_sub_id FROM subscriptions WHERE organization_id = $1',
      [organization_id]
    );

    if (!subscription) {
      return responseREST(
        res,
        httpStatus.NOT_FOUND,
        'Subscription not found'
      );
    }

    // Update subscription in Stripe
    const updatedSubscription = await stripe.subscriptions.update(
      subscription.stripe_sub_id,
      { cancel_at_period_end: status === 'cancel' }
    );

    // Update the subscription status in our database
    await $main.none(
      `UPDATE subscriptions 
       SET unsubscribe_date = $1,
           updated_at = NOW(),
           updated_by = $2
       WHERE organization_id = $3`,
      [status === 'cancel' ? new Date() : null, req.userInfo.user_id, organization_id]
    );

    const message = status === 'cancel' 
      ? 'Subscription cancelled successfully'
      : 'Subscription has been reactivated successfully';

    return responseREST(res, httpStatus.SUCCESS, message, {
      [status === 'cancel' ? 'cancel_at' : 'current_period_end']: 
        new Date(status === 'cancel' ? updatedSubscription.cancel_at * 1000 : updatedSubscription.current_period_end * 1000)
    });
  } catch (error) {
    $logger.error('Error changing subscription status:', error);
    return responseRESTError(
      req,
      res,
      error.message
    );
  }
}

const listInvoices = async (req, res) => {
  const { organization_id } = req.userInfo;
  const { limit = 10, starting_after } = req.query;

  try {
    // Get the organization's stripe customer ID
    const organization = await $main.oneOrNone(
      'SELECT stripe_customer_id FROM organizations WHERE id = $1',
      [organization_id]
    );

    if (!organization?.stripe_customer_id) {
      return responseREST(res,httpStatus.SUCCESS,"Invoices fetched successfully", {
        invoices: [],
        has_more: false,
        total_count: 0
      });
    }

    // Fetch invoices from Stripe
    const invoiceOptions = {
      customer: organization.stripe_customer_id,
      limit: Math.min(100, Math.max(1, parseInt(limit))), // Ensure limit is between 1 and 100
      // status: 'paid', // Only fetch paid invoices
      expand: ['data.subscription']
    };

    if (starting_after) {
      invoiceOptions.starting_after = starting_after;
    }

    const invoices = await stripe.invoices.list(invoiceOptions);

    // Transform the invoice data to include only necessary information
    const formattedInvoices = invoices.data.map(invoice => ({
      id: invoice.id,
      subscription_id: invoice.subscription?.id,
      amount_paid: invoice.amount_paid / 100, // Convert from cents to dollars
      currency: invoice.currency,
      status: invoice.status,
      invoice_pdf: invoice.invoice_pdf,
      hosted_invoice_url: invoice.hosted_invoice_url,
      period_start: new Date(invoice.period_start * 1000),
      period_end: new Date(invoice.period_end * 1000),
      created: new Date(invoice.created * 1000),
      paid_at: invoice.status === 'paid' ? new Date(invoice.status_transitions.paid_at * 1000) : null
    }));

    return responseREST(res,httpStatus.SUCCESS,"Invoices fetched successfully", {
      invoices: formattedInvoices,
      has_more: invoices.has_more,
      total_count: invoices.total_count
    });
  } catch (error) {
    $logger.error('Error fetching invoices:', error);
    return responseRESTError(
      req,
      res,
      error.message
    );
  }
};

const getSubscriptionDetails = async (req, res) => {
  const { organization_id } = req.userInfo;

  try {
    // Get customer and subscription IDs
    const customerData = await $main.oneOrNone(`
      SELECT o.stripe_customer_id, s.stripe_sub_id 
      FROM organizations o
      LEFT JOIN subscriptions s ON o.id = s.organization_id
      WHERE o.id = $1
    `, [organization_id]);

    if (!customerData) {
      subscriptionDetails = {
        status: 'active',
        current_period_start: null,
        current_period_end: null,
        cancel_at: null,
        canceled_at: null,
        trial_start: null,
        trial_end: null,
        package_name: "Free",
        maus_quantity: 500,
        interval: null,
        default_payment_method: null,
        days_until_due: null,
        schedule: null,
        next_payment_amount: null,
        next_payment_attempt: null,
        credit: 0
      };
      return responseREST(res, httpStatus.SUCCESS, 'Subscription details fetched successfully', subscriptionDetails);
    }

    // Get package and MAUs prices
    let subscriptionDetails = {};

    if (customerData.stripe_sub_id) {
      // Get subscription details
      const [subscription, upcomingInvoice] = await Promise.all([
        stripe.subscriptions.retrieve(customerData.stripe_sub_id, {
          expand: ['items.data.price.product', 'customer']
        }),
        stripe.invoices.retrieveUpcoming({
          customer: customerData.stripe_customer_id,
          subscription: customerData.stripe_sub_id
        }),
      ]);
      const package_name = subscription.items.data.find(item => item.quantity === 1).price.product.name;
      const maus_quantity = subscription.items.data.find(item => item.quantity > 1).quantity;
      const interval = subscription.items.data[0].price.recurring.interval;

      subscriptionDetails = {
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000),
        current_period_end: new Date(subscription.current_period_end * 1000),
        cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
        canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
        trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
        package_name,
        maus_quantity,
        interval,
        default_payment_method: subscription.default_payment_method,
        days_until_due: subscription.days_until_due,
        schedule: subscription.schedule,
        next_payment_amount: upcomingInvoice.amount_due,
        next_payment_attempt: upcomingInvoice.next_payment_attempt ? 
          new Date(upcomingInvoice.next_payment_attempt * 1000) : null,
        credit: subscription.customer.balance
      };
    }

    return responseREST(res, httpStatus.SUCCESS, 'Subscription details fetched successfully', subscriptionDetails);
  } catch (error) {
    $logger.error('Error in getSubscriptionDetails:', error);
    return responseRESTError(
      req,
      res,
      error.message
    );
  }
};

const listPaymentMethods = async (req, res) => {
  const { organization_id } = req.userInfo;

  try {    
    const result = await $main.task(async t => {
      // Get organization's stripe customer ID
      const org = await t.oneOrNone(
        'SELECT stripe_customer_id FROM organizations WHERE id = $1',
        [organization_id]
      );

      if (!org) {
        return responseRESTError(
          res,
          httpStatus.NOT_FOUND,
          'Organization not found'
        );
      }

      if (!org.stripe_customer_id) {
        return responseREST(res, httpStatus.SUCCESS, "Payment methods fetched successfully", []);
      }

      // Get payment methods from Stripe
      const paymentMethods = await stripe.paymentMethods.list({
        customer: org.stripe_customer_id,
        type: 'card'
      });

      const formattedPaymentMethods = paymentMethods.data.map(method => ({
        id: method.id,
        type: method.type,
        card: {
          brand: method.card.brand,
          exp_month: method.card.exp_month,
          exp_year: method.card.exp_year,
          last4: method.card.last4,
          funding: method.card.funding
        },
        billing_details: {
          name: method.billing_details.name,
          email: method.billing_details.email,
          address: method.billing_details.address
        },
        is_default: method.id === paymentMethods.data[0].id
      }));

      return responseREST(res, httpStatus.SUCCESS, "Payment methods fetched successfully", formattedPaymentMethods);
    });

    return result;
  } catch (error) {
    $logger.error('Error in listPaymentMethods:', error);
    return responseRESTError(
      req,
      res,
      error.message
    );
  }
};

const deletePaymentMethod = async (req, res) => {
  const { payment_method_id } = req.params;
  const { organization_id } = req.userInfo;

  try {    
    await $main.task(async t => {
      // Get organization's stripe customer ID
      const org = await t.oneOrNone(
        'SELECT stripe_customer_id FROM organizations WHERE id = $1',
        [organization_id]
      );

      if (!org) {
        return responseRESTError(
          req,
          res,
          'Organization not found'
        );
      }

      if (!org.stripe_customer_id) {
        return responseRESTError(
          req,
          res,
          'No payment methods found for this organization'
        );
      }

      try {
        // Verify the payment method belongs to this customer
        const paymentMethod = await stripe.paymentMethods.retrieve(payment_method_id);
        if (paymentMethod.customer !== org.stripe_customer_id) {
          return responseRESTError(
            req,
            res,
            'Payment method does not belong to this organization'
          );
        }

        // Detach the payment method from the customer
        await stripe.paymentMethods.detach(payment_method_id);

        return responseREST(res, httpStatus.SUCCESS, "Payment method successfully deleted");
      } catch (stripeError) {
        if (stripeError.code === 'resource_missing') {
          return responseRESTError(
            req,
            res,
            'Payment method not found'
          );
        }
        return responseRESTError(
          req,
          res,
          stripeError.message
        );
      }
    });
  } catch (error) {
    $logger.error('Error in deletePaymentMethod:', error);
    return responseRESTError(
      req,
      res,
      error.message
    );
  }
};

const getUpcomingInvoiceAmount = async (req, res) => {
  const functionName = "getUpcomingInvoiceAmount";
  const tenantDb = $connectTenant(req.userInfo.email);
  
  try {
    const { price_id, mau_quantity} = req.body;
    const { organization_id } = req.userInfo;

    const result = await $main.task(async (t) => {
      // Get price details from the database
      const priceDetails = await t.oneOrNone(
        `SELECT pp.id AS price_id, pp.reference_price_id, p.id AS package_id, 
                p.name AS package_name, p.maus_unit_limit, pp.price, 
                pp2.reference_price_id AS maus_reference_price_id
         FROM packages p
         INNER JOIN package_prices pp ON p.id = pp.package_id
         LEFT JOIN package_prices pp2 ON p.id = pp2.parent_package_id 
            AND pp2.interval_type_id = pp.interval_type_id
         WHERE pp.id = $1 AND pp.status = 1`,
        [price_id]
      );
      
      if (!priceDetails || !priceDetails.reference_price_id) {
        return responseRESTError(
          res,
          httpStatus.BAD_REQUEST,
          "Invalid or inactive price ID"
        );
      }
      
      if (!priceDetails.maus_reference_price_id) {
        return responseRESTError(
          res,
          httpStatus.BAD_REQUEST,
          "Missing MAU price reference. Contact support."
        );
      }

      if (mau_quantity <= 0 || (priceDetails.maus_unit_limit && mau_quantity > priceDetails.maus_unit_limit)) {
        return responseRESTError(
          res,
          httpStatus.BAD_REQUEST,
          "Invalid MAU quantity"
        );
      }

      // Get current subscription if exists
      const currentSubscription = await t.oneOrNone(
        `SELECT id, stripe_sub_id, status 
         FROM subscriptions 
         WHERE organization_id = $1 
         LIMIT 1`,
        [organization_id]
      );

      if(!currentSubscription?.stripe_sub_id) {
        return responseREST(res, httpStatus.SUCCESS, {});
      }

      const stripeCustomerId = await getOrCreateStripeCustomer(t, organization_id);
      
      try {
        let invoicePreview;
        
        // if (currentSubscription?.stripe_sub_id) {
          // If there's an existing subscription, calculate proration
          const stripeSubscription = await stripe.subscriptions.retrieve(
            currentSubscription.stripe_sub_id,
            { expand: ['items'] }
          );

          const items = buildSubscriptionItems(stripeSubscription, priceDetails, mau_quantity);

          invoicePreview = await stripe.invoices.retrieveUpcoming({
            customer: stripeCustomerId,
            subscription: currentSubscription.stripe_sub_id,
            subscription_items: items,
            subscription_proration_behavior: 'always_invoice'
          });
        // } else {
        //   // For new subscriptions
        //   invoicePreview = await stripe.invoices.retrieveUpcoming({
        //     customer: stripeCustomerId,
        //     subscription_items: [
        //       {
        //         price: priceDetails.reference_price_id,
        //         quantity: 1
        //       },
        //       {
        //         price: priceDetails.maus_reference_price_id,
        //         quantity: mau_quantity
        //       }
        //     ]
        //   });
        // }

        // // Format the response
        const invoiceDetails = {
          subtotal: invoicePreview.subtotal / 100, // Convert from cents to dollars
          total: invoicePreview.total / 100,
          dueAmount: invoicePreview.amount_due / 100,
          savedAmount:
            invoicePreview.total_discount_amounts.length > 0
              ? Number(invoicePreview.total_discount_amounts[0].amount / 100)
              : 0,
          appliedCreditBalance: Math.abs(invoicePreview.starting_balance - invoicePreview.ending_balance) / 100
        };

        return responseREST(res, httpStatus.OK, invoiceDetails);
      } catch (stripeError) {
        $logger.error(`${functionName} Stripe Error:`, stripeError);
        return responseRESTError(
          res,
          httpStatus.BAD_REQUEST,
          stripeError.message
        );
      }
    });

    return result;
  } catch (error) {
    $logger.error(`${functionName}:`, error);
    return responseRESTError(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to calculate upcoming invoice amount'
    );
  }
};

const logPurchase = async (t, {
  organization_id,
  package_id,
  package_price_id,
  status,
  session_id,
  user_id,
  mau_quantity,
  previous_subscription_id = null,
  error_message = null
}) => {
  const query = `
    INSERT INTO purchase_logs (
      organization_id, package_id, package_price_id, status, session_id,
      created_by, maus_quantity, previous_subscription_id, error_message
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  `;
  
  return t.none(query, [
    organization_id,
    package_id,
    package_price_id,
    status,
    session_id,
    user_id,
    mau_quantity,
    previous_subscription_id,
    error_message
  ]);
};

const buildSubscriptionItems = (stripeSubscription, priceDetails, mau_quantity) => {
  const items = [];
  const existingBaseItem = stripeSubscription.items.data.find(
    item => item.price.id === priceDetails.reference_price_id
  );
  const existingMAUItem = stripeSubscription.items.data.find(
    item => item.price.id === priceDetails.maus_reference_price_id
  );

  // Handle base subscription item
  if (existingBaseItem) {
    if (existingMAUItem && existingMAUItem.quantity !== mau_quantity) {
      items.push({
        id: existingMAUItem.id,
        quantity: mau_quantity
      });
    }
  } else {
    stripeSubscription.items.data.forEach(item => {
      items.push({ id: item.id, deleted: true });
    }); 
    items.push(
      { price: priceDetails.reference_price_id, quantity: 1 },
      { price: priceDetails.maus_reference_price_id, quantity: mau_quantity }
    );
  }
  return items;
};

export const upgradeDowngradeSubscription = async (email, organization_id,package_id,maus_quantity) => {
  const functionName = "upgradeDowngradeSubscription";
  try {

    const tenantDb = $connectTenant(email);

    await isDefaultDataUpToDate(tenantDb);

    const packageFeaturesQuery = `
      SELECT 
        paf.feature_id,
        paf.feature_limit,
        f.name,
        f.input_type_id
      FROM 
        package_application_features paf
      JOIN 
        features f ON f.id = paf.feature_id
      WHERE 
        paf.package_id = $1 and paf.status = $2 and f.status = $3
    `;

    const packageFeatures = await $main.any(packageFeaturesQuery, [package_id]);

    let updateQuery = 'UPDATE features SET "limit" = 0;';
    for (const feature of packageFeatures) {
      if(feature.feature_limit !== -1) {
        //add dowgrade logic here if limit is less then current usage
        if(feature.name === 'Survey') {
          
        }else if(feature.name === 'DemoX') {
          
        }else if(feature.name === 'Launcher') {
          
        }else if(feature.name === 'Checklist') {
          
        }else if(feature.name === 'Product Tour') {

        }else if(feature.name === 'Domains') {
          
        }else if(feature.name === 'Team') {
          
        }
      }
      updateQuery += `UPDATE features SET "limit" = ${feature.feature_limit} WHERE id = '${feature.feature_id}';`;
    }
     updateQuery += `UPDATE features SET "limit" = ${maus_quantity} WHERE name = 'MAUs';`;
     updateQuery += `
      UPDATE features 
      SET status = ${dbStatus.DELETE} 
      WHERE id NOT IN (${packageFeatures.map(feature => feature.feature_id).join(', ')})
    `;  
    await tenantDb.none(updateQuery);

    return {
      status: true
    }
  } catch (error) {
    return {
      status :false,
      error : error
    }
  }
};

const isDefaultDataUpToDate = async (tenantDb) => {
  try {

    const [
      features,
      subFeatures,
      featureTypes
    ] = await $main.batch([
      $main.manyOrNone(
        `
            SELECT f.id, f.name 
            FROM features f 
            WHERE f.status = $1
        `,  
        [dbStatus.ENABLE]
      ),
      $main.manyOrNone(`
        SELECT * 
        FROM sub_features 
        WHERE status = ${dbStatus.ENABLE}
      `),
      $main.manyOrNone(`
        SELECT id, name, can_create, can_update, can_read, can_delete, 
               can_action, can_export, can_import, status
        FROM feature_types
        WHERE status = ${dbStatus.ENABLE}
      `)
    ]);
  
    const [
      featuersInTenant,
      subFeaturesInTenant,
      featureTypesInTenant
    ] = await tenantDb.batch([
      tenantDb.manyOrNone(`
        SELECT id 
        FROM features 
        WHERE status = ${dbStatus.ENABLE}
      `),
      tenantDb.manyOrNone(`
        SELECT id 
        FROM sub_features 
        WHERE status = ${dbStatus.ENABLE}
      `),
      tenantDb.manyOrNone(`
        SELECT id
        FROM feature_types
        WHERE status = ${dbStatus.ENABLE}
      `)
    ]);

    const featuresToInsert = features.filter(f => !featuersInTenant.find(t => t.id === f.id));
    const subFeaturesToInsert = subFeatures.filter(sf => !subFeaturesInTenant.find(t => t.id === sf.id));
    const featureTypesToInsert = featureTypes.filter(ft => !featureTypesInTenant.find(t => t.id === ft.id));

    const insertQueries = ``;
    if(featuresToInsert.length > 0) {
      const featureInsertQuery = `INSERT INTO features (id, name, status, "limit") VALUES `;
      let featureValues = [];
      for (let feature of featuresToInsert) {
        featureValues.push(
          ('${feature.id}', '${feature.name}', '${ dbStatus.DISABLE }', 0)
        );
      }
      insertQueries += featureInsertQuery + featureValues.join(", ") + ";";
    }

    if(featureTypesToInsert.length > 0) {
      let featureTypeInsertQuery = `INSERT INTO feature_types (id, name, can_create, can_update, can_read, can_delete, can_action, can_export, can_import, status) VALUES `;
      let featureTypeValues = [];
      for (let featureType of featureTypesToInsert) {
        featureTypeValues.push(
          ('${featureType.id}', '${featureType.name}', '${featureType.can_create}', '${featureType.can_update}', '${featureType.can_read}', '${featureType.can_delete}', '${featureType.can_action}', '${featureType.can_export}', '${featureType.can_import}', '${featureType.status}')
        );
      }
      insertQueries += featureTypeInsertQuery + featureTypeValues.join(", ") + ";";
    }

    if(subFeaturesToInsert.length > 0) {

      const ownerRoleId = await tenantDb.oneOrNone(
        `SELECT id FROM roles WHERE name = 'Account Owner'`,
      );

      // Sub Feature Insert Query
      let subFeatureInsertQuery = `INSERT INTO sub_features (id, feature_id, key, feature_type_id, status, name) VALUES `;
      let permissionSubFeatureInsertQuery = `INSERT INTO permission_sub_features (role_id, sub_feature_id, can_create, can_read, can_update, can_delete, can_action, can_export, can_import, created_by) VALUES `;
      let subFeatureValues = [];
      let permissionSubFeatureValues = [];

      for (let subFeature of subFeaturesToInsert) {

        subFeatureValues.push(
          ('${subFeature.id}', '${subFeature.feature_id}', '${subFeature.key}', '${subFeature.feature_type_id}', '${subFeature.status}', '${subFeature.name}')
        );

        const featureType = featureTypes.find(
          (ft) => ft.id === subFeature.feature_type_id
        );
        permissionSubFeatureValues.push(
          `('${ownerRoleId.id}', '${subFeature.id}', ${
            featureType.can_create ? true : null
          }, ${featureType.can_read ? true : null}, ${
            featureType.can_update ? true : null
          }, ${featureType.can_delete ? true : null},${
            featureType.can_action ? true : null
          }, ${featureType.can_export ? true : null}, ${
            featureType.can_import ? true : null
          }, '${user_id}')`
        );
      }
      insertQueries += subFeatureInsertQuery + subFeatureValues.join(", ") + ";";
      insertQueries += permissionSubFeatureInsertQuery + permissionSubFeatureValues.join(", ") + ";";
    }

    if(insertQueries.length > 0) {
      await tenantDb.none(insertQueries);
    }
    return true;
  } catch (error) {
    console.error('while checking default data up-to-date', error);
  }
}

export {
  createSubscriptionService,
  changeSubscriptionStatus,
  listInvoices,
  getSubscriptionDetails,
  listPaymentMethods,
  deletePaymentMethod,
  getUpcomingInvoiceAmount
};
