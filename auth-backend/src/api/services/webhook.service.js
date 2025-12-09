import { responseRESTError, responseREST, httpStatus } from "../../common/functions.js";
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const handleWebhook = async (req, res) => {
  // const sig = req.headers['stripe-signature'];
  try {
    // Verify webhook signature
    // const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log("req.body", req.body);
    const event = req.body;
    switch (event.type) {
      case 'customer.subscription.updated':
        await subscriptionUpdated(event);
        break;
      case 'customer.subscription.created':
        await subscriptionUpdated(event);
        break;
      case 'customer.subscription.deleted':
        await subscriptionDeleted(event);
        break;
      default:
        $logger.info(`Unhandled event type: ${event.type}`);
    }

    return responseREST(res, httpStatus.SUCCESS, { received: true });
  } catch (error) {
    $logger.error('Webhook Error:', error.message);
    return responseRESTError(
      res,
      httpStatus.BAD_REQUEST,
      `Webhook Error: ${error.message}`
    );
  }
};

const subscriptionUpdated = async (event) => {
  const eventData = event.data.object;
  try {
    await $main.tx(async t => {
      // Insert or update the new subscription

      const orgData = await t.oneOrNone(
        `SELECT id, created_by FROM organizations WHERE stripe_customer_id = $1`,
        [eventData.customer]
      );

      const prices = await t.any(
        `SELECT pp.id, p.type, pp.reference_price_id FROM package_prices pp
         JOIN packages p ON p.id = pp.package_id
         WHERE pp.reference_price_id in ($1, $2)`,
        [eventData.items.data[0].price.id, eventData.items.data[1].price.id]
      );

      const mausPrice = prices.find(p => p.type === 'maus');
      const packagePrice = prices.find(p => p.type !== 'maus');

      const insertObject = {
        organization_id: orgData.id,
        user_id: orgData.created_by,
        package_price_id: packagePrice.id,
        maus_price_id: mausPrice.id,
        maus_quantity: eventData.items.data.find(p => p.price.id === mausPrice.reference_price_id).quantity,
        stripe_sub_id: eventData.id,  
        start_date: new Date(eventData.current_period_start * 1000).toISOString(),
        end_date: new Date(eventData.current_period_end * 1000).toISOString(),
        is_free: false,
        is_trial: eventData.status === 'trialing' ? true : false,
        grand_total: 0,
        status: 1,
        coupon_code_id: null,
        additional_discount_id: null,
      };

      // Insert or update the subscription
      await t.none(
        `INSERT INTO subscription_historys (
          id, organization_id, package_price_id, maus_price_id, 
          maus_quantity, stripe_sub_id, start_date, end_date, 
          is_free, is_trial, grand_total, status, 
          coupon_code_id, additional_discount_id, 
          created_at, updated_at, created_by, updated_by
        ) SELECT 
          id, organization_id, package_price_id, maus_price_id, 
          maus_quantity, stripe_sub_id, start_date, end_date, 
          is_free, is_trial, grand_total, status, 
          coupon_code_id, additional_discount_id, 
          created_at, updated_at, created_by, updated_by
        FROM subscriptions 
        WHERE organization_id = $1`,
        [insertObject.organization_id]
      );

      // Delete the old subscription
      await t.none(`DELETE FROM subscriptions WHERE organization_id = $1`, [insertObject.organization_id]);

      //now create new subscription
      await t.none(`
        INSERT INTO subscriptions (
           organization_id, package_price_id, maus_price_id, 
          maus_quantity, stripe_sub_id, start_date, end_date, 
          is_free, is_trial, grand_total, status, 
          coupon_code_id, additional_discount_id,
          created_at, updated_at, created_by
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, now(), now(),
          $14
        )
      `, [
        insertObject.organization_id,
        insertObject.package_price_id,
        insertObject.maus_price_id,
        insertObject.maus_quantity,
        insertObject.stripe_sub_id,
        insertObject.start_date,
        insertObject.end_date,
        insertObject.is_free,
        insertObject.is_trial,
        insertObject.grand_total,
        insertObject.status,
        insertObject.coupon_code_id,
        insertObject.additional_discount_id,
        insertObject.user_id
      ]);

      $logger.info(`Subscription ${eventData.id} updated successfully`);
    });

  } catch (error) {
    $logger.error('Error in subscriptionUpdated:', error);
    throw error;
  }
};

// const subscriptionCreated = async (event) => {
  
// }

const subscriptionDeleted = async (event) => {
  const eventData = event.data.object;

  try {
    const orgData = await t.oneOrNone(
      `SELECT id, created_by FROM organizations WHERE stripe_customer_id = $1`,
      [eventData.customer]
    );


    await t.none(
      `INSERT INTO subscription_historys (
        id, organization_id, package_price_id, maus_price_id, 
        maus_quantity, stripe_sub_id, start_date, end_date, 
        is_free, is_trial, grand_total, status, 
        coupon_code_id, additional_discount_id, 
        created_at, updated_at, created_by, updated_by
      ) SELECT 
        id, organization_id, package_price_id, maus_price_id, 
        maus_quantity, stripe_sub_id, start_date, end_date, 
        is_free, is_trial, grand_total, status, 
        coupon_code_id, additional_discount_id, 
        created_at, updated_at, created_by, updated_by
      FROM subscriptions 
      WHERE organization_id = $1`,
      [orgData.id]
    );

    // Delete the old subscription
    await t.none(`DELETE FROM subscriptions WHERE organization_id = $1`, [orgData.id]);

    const insertObject = {
      organization_id: orgData.id,
      user_id: orgData.created_by,
      package_price_id: null,
      maus_price_id: null,
      maus_quantity: 0,
      stripe_sub_id: null,
      start_date: new Date().toISOString(),
      end_date: null,
      is_free: true,
      is_current: true,
      is_trial: false,
      grand_total: 0,
      status: 1,
      coupon_code_id: null,
      additional_discount_id: null,
    };

    //now create new subscription
    await t.none(`
      INSERT INTO subscriptions (
        organization_id, package_price_id, maus_price_id, 
        maus_quantity, stripe_sub_id, start_date, end_date, 
        is_free, is_trial, grand_total, status, 
        coupon_code_id, additional_discount_id,
        created_at, updated_at, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, now(), now(),
        $14
      )
    `, [
      insertObject.organization_id,
      insertObject.package_price_id,
      insertObject.maus_price_id,
      insertObject.maus_quantity,
      insertObject.stripe_sub_id,
      insertObject.start_date,
      insertObject.end_date,
      insertObject.is_free,
      insertObject.is_trial,
      insertObject.grand_total,
      insertObject.status,
      insertObject.coupon_code_id,
      insertObject.additional_discount_id,
      insertObject.user_id
    ]);

  } catch (error) {
    console.log("subscriptionDeleted:ERROR", error)
  }
}

export { handleWebhook };
