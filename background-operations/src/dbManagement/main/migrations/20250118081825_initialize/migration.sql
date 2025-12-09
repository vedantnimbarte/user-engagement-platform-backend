-- CreateTable
CREATE TABLE "additional_discounts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "period" INTEGER,
    "discount_type_id" UUID,
    "discount" VARCHAR(255),
    "description" TEXT,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,

    CONSTRAINT "additional_discount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addon_packages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,
    "stripe_product_id" TEXT,
    "name" VARCHAR(255),
    "limit" INTEGER,
    "unit_interval" SMALLINT,

    CONSTRAINT "addon_package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addon_prices" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "addon_package_id" UUID NOT NULL,
    "price" DECIMAL NOT NULL,
    "currency_id" UUID NOT NULL,
    "stripe_price_id" TEXT,
    "interval_type_id" UUID,
    "status" SMALLINT NOT NULL DEFAULT 1,

    CONSTRAINT "addon_price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(20) NOT NULL,
    "description" TEXT,
    "license_type_id" UUID,
    "privacy_policy" TEXT,
    "terms_of_service" TEXT,
    "documentation" TEXT,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "release_on" TIMESTAMPTZ(6),
    "overview" TEXT,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,
    "type" VARCHAR(6) NOT NULL,
    "logo" TEXT,
    "environment" VARCHAR(255),

    CONSTRAINT "application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_demos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(60) NOT NULL,
    "country_id" SMALLINT,
    "phone_number" DECIMAL(15,0),
    "description" TEXT,
    "demo_date_time" TIMESTAMPTZ(6),
    "is_demo_completed" BOOLEAN NOT NULL DEFAULT false,
    "demo_completed_at" TIMESTAMPTZ(6),
    "note" TEXT,
    "assigned_to" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" UUID,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "book_demo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_brands" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255),
    "image_url" TEXT,
    "reference_name" VARCHAR(255),

    CONSTRAINT "card_brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "common" (
    "id" UUID NOT NULL,
    "key" VARCHAR NOT NULL,
    "value" JSON,

    CONSTRAINT "common_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "phone_code" DECIMAL(3,0),
    "iso_code_2" VARCHAR(2),
    "iso_code_3" VARCHAR(3),
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "flag_url" TEXT,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,

    CONSTRAINT "country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupon_codes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "discount_type_id" UUID NOT NULL,
    "package_id" UUID,
    "code" VARCHAR(10) NOT NULL,
    "expiry_date" TIMESTAMPTZ(6),
    "quantity" INTEGER,
    "discount" DECIMAL(10,0),
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,
    "start_date" TIMESTAMPTZ(6),
    "addon_package_id" UUID,
    "stripe_code" VARCHAR NOT NULL,
    "name" VARCHAR,
    "package_price_id" UUID,
    "quantity_per_account" SMALLINT,
    "interval_type_id" UUID,

    CONSTRAINT "coupon_code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currencies" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(20) NOT NULL,
    "symbol" VARCHAR(3),
    "code" VARCHAR(3),
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_default" BOOLEAN DEFAULT false,

    CONSTRAINT "currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_types" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(50) NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,

    CONSTRAINT "discount_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "early_access_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organization_name" VARCHAR(255),
    "subdomain" VARCHAR(255),
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "email" VARCHAR(255),
    "team_role" TEXT,
    "team_size" TEXT,
    "other_info" TEXT,

    CONSTRAINT "early_access_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_notifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" VARCHAR(50) NOT NULL,
    "email_addresses" VARCHAR[],
    "status" SMALLINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,
    "description" TEXT,

    CONSTRAINT "email_notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_template_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" SMALLINT NOT NULL DEFAULT 1,

    CONSTRAINT "email_template_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_templates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "subject" TEXT,
    "content" TEXT,
    "is_notification_active" BOOLEAN,
    "notification_content" TEXT,
    "notification_link" TEXT,
    "internal_notes" TEXT,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,
    "email_template_category_id" UUID,

    CONSTRAINT "email_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_listeners" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "listener" VARCHAR(100) NOT NULL,
    "logo_url" TEXT,
    "description" TEXT,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,

    CONSTRAINT "event_listener_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_types" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(20) NOT NULL,
    "can_create" BOOLEAN,
    "can_read" BOOLEAN,
    "can_update" BOOLEAN,
    "can_delete" BOOLEAN,
    "can_action" BOOLEAN,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,
    "can_export" BOOLEAN,
    "can_import" BOOLEAN DEFAULT false,

    CONSTRAINT "feature_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "features" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(256) NOT NULL,
    "description" TEXT,
    "license_type_id" UUID,
    "release_date" TIMESTAMPTZ(6),
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,
    "logo_url" TEXT,
    "environment" VARCHAR(255),
    "input_type_id" UUID,

    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geo_zone_country_state" (
    "geo_zone_id" SMALLINT NOT NULL,
    "country_id" SMALLINT NOT NULL,
    "state_id" SMALLINT NOT NULL
);

-- CreateTable
CREATE TABLE "geo_zones" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "description" TEXT,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,
    "key" VARCHAR(50),
    "currency_id" UUID,

    CONSTRAINT "geo_zone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "input_types" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(30),
    "key" VARCHAR(30),
    "is_multi_select" BOOLEAN DEFAULT false,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,

    CONSTRAINT "input_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integration_platforms" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "icon_url" VARCHAR,
    "name" VARCHAR,
    "description" VARCHAR,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,
    "configuration" JSON,
    "key" VARCHAR(100),

    CONSTRAINT "integration_platform_id_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interval_types" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR,
    "key" VARCHAR NOT NULL,
    "value" SMALLINT NOT NULL,

    CONSTRAINT "interval_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subscription_id" UUID NOT NULL,
    "start_date" TIMESTAMPTZ(6),
    "end_date" TIMESTAMPTZ(6),
    "description" VARCHAR(255),
    "amount" DECIMAL(10,2),
    "status" VARCHAR,
    "user_id" UUID,
    "reference_invoice_id" TEXT,
    "host_url" VARCHAR(255),
    "invoice_number" VARCHAR(50),
    "billing_address" JSON,
    "payment_method" VARCHAR(255),

    CONSTRAINT "invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "language_variables" (
    "language_id" SMALLINT NOT NULL,
    "variables" JSON NOT NULL,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID
);

-- CreateTable
CREATE TABLE "languages" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "flag_url" TEXT,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,
    "code" VARCHAR(2),

    CONSTRAINT "locale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "license_types" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(20) NOT NULL,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,

    CONSTRAINT "license_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_cards" (
    "organization_id" UUID,
    "last_four_digits" VARCHAR(255),
    "cvv_status" VARCHAR(255),
    "expiry_month" VARCHAR(255),
    "stripe_card_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "brand_id" UUID,
    "is_default" BOOLEAN DEFAULT false,
    "expiry_year" VARCHAR(255),

    CONSTRAINT "account_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_mau_counts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organization_id" UUID NOT NULL,
    "month_started_at" TIMESTAMPTZ(6) NOT NULL,
    "month_ended_at" TIMESTAMPTZ(6) NOT NULL,
    "mau_count" INTEGER NOT NULL DEFAULT 0,
    "subscription_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exhaust_percentage" SMALLINT,

    CONSTRAINT "account_mau_count_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_theme_settings" (
    "organization_id" UUID NOT NULL,
    "theme" VARCHAR(255),
    "survey" JSON,
    "product_tour" JSON,
    "checklist" JSON,
    "custom_css" JSON,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "demoz" JSON,
    "helper" JSON,

    CONSTRAINT "account_theme_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "logo_url" TEXT,
    "address_line1" TEXT,
    "email" VARCHAR(60),
    "country_id" SMALLINT,
    "phone_number" DECIMAL(15,0),
    "type" VARCHAR(8) NOT NULL,
    "timezone_id" SMALLINT,
    "domain" VARCHAR(256),
    "subdomain" VARCHAR(256),
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,
    "package_id" UUID,
    "script_id" VARCHAR(255),
    "is_script_installed" BOOLEAN,
    "last_published_at" TIMESTAMPTZ(6),
    "script_installed_at" TIMESTAMPTZ(6),
    "published_version" VARCHAR(20),
    "currency_id" UUID,
    "city" VARCHAR(255),
    "state_id" SMALLINT,
    "zip_code" VARCHAR(12),
    "address_line2" TEXT,
    "website_url" TEXT,
    "phone_country_id" SMALLINT,
    "is_phone_verified" BOOLEAN DEFAULT false,
    "phone_verified_at" TIMESTAMPTZ(6),
    "theme_settings" JSON,
    "tax_ids" JSON[],
    "is_early_access" BOOLEAN NOT NULL DEFAULT false,
    "other_info" JSON,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otps" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "expired_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" VARCHAR(50) NOT NULL,
    "old_value" TEXT,
    "new_value" TEXT,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "attempts" SMALLINT,
    "otp_code" VARCHAR(6),

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_application_features" (
    "package_id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "feature_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "feature_limit" BIGINT
);

-- CreateTable
CREATE TABLE "package_applications" (
    "package_id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID
);

-- CreateTable
CREATE TABLE "package_prices" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "package_id" UUID NOT NULL,
    "currency_id" UUID NOT NULL,
    "interval_type_id" UUID NOT NULL,
    "price" DECIMAL NOT NULL,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "reference_price_id" TEXT,

    CONSTRAINT "package_price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(256) NOT NULL,
    "description" TEXT,
    "type" VARCHAR(6),
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_default" BOOLEAN DEFAULT false,
    "trial_days" SMALLINT NOT NULL DEFAULT 0,
    "stripe_product_id" TEXT,
    "additional_user_unit_limit" SMALLINT,
    "monthly_active_user_unit_limit" SMALLINT,
    "level" SMALLINT DEFAULT 0,
    "is_trial" BOOLEAN DEFAULT false,
    "can_extend_trial" BOOLEAN DEFAULT false,
    "extend_trial_days" SMALLINT DEFAULT 0,

    CONSTRAINT "package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission_sub_features" (
    "role_id" UUID NOT NULL,
    "sub_features_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "can_action" BOOLEAN,
    "can_create" BOOLEAN,
    "can_delete" BOOLEAN,
    "can_read" BOOLEAN,
    "can_update" BOOLEAN,
    "can_import" BOOLEAN DEFAULT false,
    "can_export" BOOLEAN DEFAULT false,

    CONSTRAINT "permission_sub_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_tour_template_types" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" VARCHAR(30),
    "thumbnail_url" TEXT,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,
    "sort_order" SMALLINT,

    CONSTRAINT "product_tour_template_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_tour_templates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "content" TEXT,
    "thumbnail_url" TEXT,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,
    "description" TEXT,
    "sort_order" SMALLINT,

    CONSTRAINT "product_tour_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organization_id" UUID NOT NULL,
    "package_id" UUID NOT NULL,
    "package_price_id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "session_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "addon_package_per_user_id" UUID,
    "addon_package_monthly_active_user_id" UUID,
    "additional_user_quantity" SMALLINT,
    "monthly_active_user_quantity" SMALLINT,

    CONSTRAINT "purchase_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restricted_sub_domains" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,

    CONSTRAINT "sub_domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(256) NOT NULL,
    "description" TEXT,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sandbox_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "logo_url" TEXT,
    "key" VARCHAR(255),
    "status" SMALLINT DEFAULT 1,

    CONSTRAINT "category_id_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "socket_organizations" (
    "organization_id" UUID NOT NULL,
    "socket_id" TEXT,
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "socket_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "states" (
    "id" SMALLSERIAL NOT NULL,
    "country_id" SMALLINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(6),
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,

    CONSTRAINT "state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_features" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "key" VARCHAR(255) NOT NULL,
    "environment" VARCHAR(255),
    "released_on" TIMESTAMPTZ(6),
    "feature_type_id" UUID,
    "description" VARCHAR,
    "feature_id" UUID NOT NULL,
    "license_type_id" UUID,

    CONSTRAINT "sub_features_id_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organization_id" UUID NOT NULL,
    "coupon_code_id" UUID,
    "additional_discount_id" UUID,
    "start_date" TIMESTAMPTZ(6),
    "end_date" TIMESTAMPTZ(6),
    "unsubscribe_date" TIMESTAMPTZ(6),
    "is_free" BOOLEAN DEFAULT false,
    "is_current" BOOLEAN DEFAULT false,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "created_by" UUID,
    "updated_by" UUID,
    "stripe_sub_id" TEXT,
    "grand_total" DECIMAL,
    "is_per_user" BOOLEAN DEFAULT false,
    "is_monthly_active_user" BOOLEAN DEFAULT false,
    "addon_package_per_user_id" UUID,
    "addon_package_monthly_active_user_id" UUID,
    "package_price_id" UUID,
    "additional_user_qty" SMALLINT,
    "monthly_active_user_qty" SMALLINT,
    "is_extended" BOOLEAN DEFAULT false,
    "is_extension_requested" BOOLEAN DEFAULT false,
    "is_trial" BOOLEAN DEFAULT false,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_element_types" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "thumbnail_url" TEXT,
    "key" VARCHAR(255) NOT NULL,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,
    "sort_order" SMALLINT,

    CONSTRAINT "nps_element_type_id_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_questions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "survey_id" UUID NOT NULL,
    "element_type_id" UUID NOT NULL,
    "question" JSON NOT NULL,
    "sort_order" SMALLINT,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,
    "logic" JSON,
    "settings" JSON,

    CONSTRAINT "nps_question_id_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_types" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(30) NOT NULL,
    "description" TEXT,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,
    "sort_order" SMALLINT,

    CONSTRAINT "nps_type_id_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surveys" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "type_id" UUID,
    "description" TEXT,
    "thumbnail_url" TEXT,
    "appearance" JSON,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,
    "sort_order" SMALLINT,
    "banner_url" TEXT,
    "original_banner_name" TEXT,

    CONSTRAINT "nps_id_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_types" (
    "tax_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "country_id" SMALLINT NOT NULL,
    "tax_type" VARCHAR(20),
    "description" VARCHAR(254),

    CONSTRAINT "country_tax_pkey" PRIMARY KEY ("tax_id")
);

-- CreateTable
CREATE TABLE "team_roles" (
    "team_role_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" UUID,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "team_role_id_pkey" PRIMARY KEY ("team_role_id")
);

-- CreateTable
CREATE TABLE "tenant_dbs" (
    "tenant_id" SERIAL NOT NULL,
    "account_id" UUID NOT NULL,
    "db_url" TEXT NOT NULL,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,
    "password" VARCHAR(20),
    "user_name" VARCHAR(20),

    CONSTRAINT "tenant_db_pkey" PRIMARY KEY ("tenant_id")
);

-- CreateTable
CREATE TABLE "timezones" (
    "id" SMALLSERIAL NOT NULL,
    "display_name" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "gmt_offset" INTEGER DEFAULT 0,

    CONSTRAINT "timezone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ug_article_template" (
    "article_template_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "article_template_key" VARCHAR(100) NOT NULL,
    "template_content" TEXT NOT NULL,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,

    CONSTRAINT "ug_article_template_pkey" PRIMARY KEY ("article_template_id")
);

-- CreateTable
CREATE TABLE "user_authentications" (
    "user_id" UUID NOT NULL,
    "is_two_fa_enabled" BOOLEAN NOT NULL DEFAULT false,
    "default_two_fa_method" VARCHAR(20),
    "password" VARCHAR(256),
    "authenticator_key" TEXT,
    "is_authenticator_verified" BOOLEAN DEFAULT false,
    "authenticator_verified_at" TIMESTAMPTZ(6),
    "is_phone_verified" BOOLEAN DEFAULT false,
    "phone_verified_at" TIMESTAMPTZ(6),
    "is_email_verified" BOOLEAN DEFAULT false,
    "email_verified_at" TIMESTAMPTZ(6),
    "login_attempts" SMALLINT DEFAULT 0,
    "last_login_attempt_at" TIMESTAMPTZ(6),
    "password_reset_token" TEXT,
    "is_two_fa_phone_enabled" BOOLEAN DEFAULT false,
    "is_two_fa_email_enabled" BOOLEAN DEFAULT false,
    "is_two_fa_authenticator_enabled" BOOLEAN DEFAULT false,
    "default_role_id" UUID,
    "default_organization_id" UUID
);

-- CreateTable
CREATE TABLE "user_login_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "browser" TEXT,
    "os" TEXT,
    "ip_address" TEXT,
    "log" TEXT NOT NULL,
    "login_at" TIMESTAMPTZ(6),
    "logout_at" TIMESTAMPTZ(6),
    "two_fa_status" VARCHAR(10),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "refresh_token" TEXT,
    "remember_me" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_login_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_notifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "notification_type" VARCHAR(20),
    "news_and_updates" SMALLINT,
    "tips_and_tutorial" SMALLINT,
    "user_research" SMALLINT,
    "user_upgrade" SMALLINT,
    "user_downgrade" SMALLINT,

    CONSTRAINT "user_notification_id_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_organizations" (
    "user_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,
    "invitation_token" TEXT,
    "invitation_accepted_at" TIMESTAMPTZ(6),
    "is_invitation_token_used" BOOLEAN,
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "invitation_role_id" UUID,

    CONSTRAINT "user_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role_association" (
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "first_name" VARCHAR(99),
    "last_name" VARCHAR(99),
    "email" VARCHAR(60) NOT NULL,
    "profile_picture_url" TEXT,
    "country_id" SMALLINT,
    "phone_number" DECIMAL(15,0),
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,
    "geo_zone_id" SMALLINT,
    "language_id" SMALLINT,
    "phone_country_id" SMALLINT,
    "timezone_id" SMALLINT,
    "is_phone_verified" BOOLEAN DEFAULT false,
    "phone_verified_at" TIMESTAMPTZ(6),
    "settings" JSON,
    "social_auth_server" VARCHAR,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "idx_applications_name" ON "applications"("name");

-- CreateIndex
CREATE UNIQUE INDEX "idx_countries_name" ON "countries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "idx_currencies_name" ON "currencies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "idx_discount_types_name" ON "discount_types"("name");

-- CreateIndex
CREATE INDEX "idx_email_notifications_created_by" ON "email_notifications"("created_by");

-- CreateIndex
CREATE INDEX "idx_email_notifications_deleted_by" ON "email_notifications"("deleted_by");

-- CreateIndex
CREATE INDEX "idx_email_notifications_updated_by" ON "email_notifications"("updated_by");

-- CreateIndex
CREATE UNIQUE INDEX "idx_email_templates_name" ON "email_templates"("name");

-- CreateIndex
CREATE UNIQUE INDEX "idx_email_templates_key" ON "email_templates"("key");

-- CreateIndex
CREATE UNIQUE INDEX "idx_event_listeners_listener" ON "event_listeners"("listener");

-- CreateIndex
CREATE UNIQUE INDEX "idx_feature_types_name" ON "feature_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "idx_geo_zone_country_state" ON "geo_zone_country_state"("geo_zone_id", "country_id", "state_id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_input_types_name" ON "input_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "idx_input_types_key" ON "input_types"("key");

-- CreateIndex
CREATE UNIQUE INDEX "idx_invoices_reference_invoice_id" ON "invoices"("reference_invoice_id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_language_variables_language_id" ON "language_variables"("language_id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_languages_name" ON "languages"("name");

-- CreateIndex
CREATE UNIQUE INDEX "idx_languages_code" ON "languages"("code");

-- CreateIndex
CREATE UNIQUE INDEX "idx_license_types_name" ON "license_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "idx_organizations_domain" ON "organizations"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "idx_organizations_subdomain" ON "organizations"("subdomain");

-- CreateIndex
CREATE INDEX "idx_otps_user_id" ON "otps"("user_id");

-- CreateIndex
CREATE INDEX "idx_package_application_features_feature_id" ON "package_application_features"("feature_id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_package_application_features" ON "package_application_features"("package_id", "application_id", "feature_id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_package_applications" ON "package_applications"("package_id", "application_id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_packages_name" ON "packages"("name");

-- CreateIndex
CREATE UNIQUE INDEX "idx_product_tour_template_types_type" ON "product_tour_template_types"("type");

-- CreateIndex
CREATE UNIQUE INDEX "idx_restricted_sub_domains_name" ON "restricted_sub_domains"("name");

-- CreateIndex
CREATE UNIQUE INDEX "idx_roles_name" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "idx_sandbox_categories_key" ON "sandbox_categories"("key");

-- CreateIndex
CREATE UNIQUE INDEX "idx_states_country_id_name" ON "states"("country_id", "name");

-- CreateIndex
CREATE INDEX "idx_subscriptions_end_date" ON "subscriptions"("end_date");

-- CreateIndex
CREATE INDEX "idx_subscriptions_is_current" ON "subscriptions"("is_current");

-- CreateIndex
CREATE INDEX "idx_subscriptions_is_free" ON "subscriptions"("is_free");

-- CreateIndex
CREATE INDEX "idx_subscriptions_organization_id" ON "subscriptions"("organization_id");

-- CreateIndex
CREATE INDEX "idx_subscriptions_start_date" ON "subscriptions"("start_date");

-- CreateIndex
CREATE UNIQUE INDEX "idx_survey_element_types_title" ON "survey_element_types"("title");

-- CreateIndex
CREATE UNIQUE INDEX "idx_survey_element_types_key" ON "survey_element_types"("key");

-- CreateIndex
CREATE UNIQUE INDEX "idx_survey_types_title" ON "survey_types"("title");

-- CreateIndex
CREATE UNIQUE INDEX "idx_tenant_dbs_account_id" ON "tenant_dbs"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_tenant_dbs_db_url" ON "tenant_dbs"("db_url");

-- CreateIndex
CREATE UNIQUE INDEX "idx_user_authentications_user_id" ON "user_authentications"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_user_organizations_user_id_organization_id" ON "user_organizations"("user_id", "organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_user_role_association_user_id_role_id" ON "user_role_association"("user_id", "role_id");

-- AddForeignKey
ALTER TABLE "additional_discounts" ADD CONSTRAINT "fk_additional_discounts_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "additional_discounts" ADD CONSTRAINT "fk_additional_discounts_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "additional_discounts" ADD CONSTRAINT "fk_additional_discounts_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "additional_discounts" ADD CONSTRAINT "fk_discount_type_additional_discount_discount_types" FOREIGN KEY ("discount_type_id") REFERENCES "discount_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "addon_packages" ADD CONSTRAINT "fk_addon_packages_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "addon_packages" ADD CONSTRAINT "fk_addon_packages_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "addon_packages" ADD CONSTRAINT "fk_addon_packages_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "addon_prices" ADD CONSTRAINT "fk_addon_prices_addon_package_id_addon_packages" FOREIGN KEY ("addon_package_id") REFERENCES "addon_packages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "addon_prices" ADD CONSTRAINT "fk_addon_prices_currency_id_currencies" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "addon_prices" ADD CONSTRAINT "fk_addon_prices_interval_type_id_interval_types" FOREIGN KEY ("interval_type_id") REFERENCES "interval_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "fk_applications_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "fk_applications_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "fk_applications_license_type_license_types" FOREIGN KEY ("license_type_id") REFERENCES "license_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "fk_applications_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "book_demos" ADD CONSTRAINT "fk_book_demos_assigned_to_users" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "book_demos" ADD CONSTRAINT "fk_book_demos_country_id_countries" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "book_demos" ADD CONSTRAINT "fk_book_demos_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "countries" ADD CONSTRAINT "fk_countries_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "countries" ADD CONSTRAINT "fk_countries_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "countries" ADD CONSTRAINT "fk_countries_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "coupon_codes" ADD CONSTRAINT "fk_coupon_codes_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "coupon_codes" ADD CONSTRAINT "fk_coupon_codes_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "coupon_codes" ADD CONSTRAINT "fk_coupon_codes_discount_type_id_discount_types" FOREIGN KEY ("discount_type_id") REFERENCES "discount_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "coupon_codes" ADD CONSTRAINT "fk_coupon_codes_interval_type_id_interval_types" FOREIGN KEY ("interval_type_id") REFERENCES "interval_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "coupon_codes" ADD CONSTRAINT "fk_coupon_codes_package_id_packages" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "coupon_codes" ADD CONSTRAINT "fk_coupon_codes_package_price_id_package_prices" FOREIGN KEY ("package_price_id") REFERENCES "package_prices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "coupon_codes" ADD CONSTRAINT "fk_coupon_codes_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "currencies" ADD CONSTRAINT "fk_currencies_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "currencies" ADD CONSTRAINT "fk_currencies_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "currencies" ADD CONSTRAINT "fk_currencies_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "discount_types" ADD CONSTRAINT "fk_discount_types_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "discount_types" ADD CONSTRAINT "fk_discount_types_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "discount_types" ADD CONSTRAINT "fk_discount_types_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "email_notifications" ADD CONSTRAINT "fk_email_notifications_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "email_notifications" ADD CONSTRAINT "fk_email_notifications_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "email_notifications" ADD CONSTRAINT "fk_email_notifications_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "email_templates" ADD CONSTRAINT "fk_email_templates_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "email_templates" ADD CONSTRAINT "fk_email_templates_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "email_templates" ADD CONSTRAINT "fk_email_templates_email_template_category_id_email_template_ca" FOREIGN KEY ("email_template_category_id") REFERENCES "email_template_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "email_templates" ADD CONSTRAINT "fk_email_templates_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_listeners" ADD CONSTRAINT "fk_event_listeners_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_listeners" ADD CONSTRAINT "fk_event_listeners_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_listeners" ADD CONSTRAINT "fk_event_listeners_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feature_types" ADD CONSTRAINT "fk_feature_types_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feature_types" ADD CONSTRAINT "fk_feature_types_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feature_types" ADD CONSTRAINT "fk_feature_types_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "features" ADD CONSTRAINT "fk_features_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "features" ADD CONSTRAINT "fk_features_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "features" ADD CONSTRAINT "fk_features_input_type_id_input_types" FOREIGN KEY ("input_type_id") REFERENCES "input_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "features" ADD CONSTRAINT "fk_features_license_type_id_license_types" FOREIGN KEY ("license_type_id") REFERENCES "license_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "features" ADD CONSTRAINT "fk_features_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "geo_zone_country_state" ADD CONSTRAINT "fk_geo_zone_country_state_country_id_countries" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "geo_zone_country_state" ADD CONSTRAINT "fk_geo_zone_country_state_geo_zone_id_geo_zones" FOREIGN KEY ("geo_zone_id") REFERENCES "geo_zones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "geo_zone_country_state" ADD CONSTRAINT "fk_geo_zone_country_state_state_id_states" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "geo_zones" ADD CONSTRAINT "fk_geo_zones_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "geo_zones" ADD CONSTRAINT "fk_geo_zones_currency_id_currencies" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "geo_zones" ADD CONSTRAINT "fk_geo_zones_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "geo_zones" ADD CONSTRAINT "fk_geo_zones_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "input_types" ADD CONSTRAINT "fk_input_types_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "input_types" ADD CONSTRAINT "fk_input_types_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "input_types" ADD CONSTRAINT "fk_input_types_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "integration_platforms" ADD CONSTRAINT "fk_integration_platforms_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "integration_platforms" ADD CONSTRAINT "fk_integration_platforms_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "integration_platforms" ADD CONSTRAINT "fk_integration_platforms_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "fk_invoices_subscription_id_subscriptions" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "language_variables" ADD CONSTRAINT "fk_language_variables_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "language_variables" ADD CONSTRAINT "fk_language_variables_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "language_variables" ADD CONSTRAINT "fk_language_variables_language_id_languages" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "language_variables" ADD CONSTRAINT "fk_language_variables_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "languages" ADD CONSTRAINT "fk_languages_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "languages" ADD CONSTRAINT "fk_languages_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "languages" ADD CONSTRAINT "fk_languages_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "license_types" ADD CONSTRAINT "fk_license_types_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "license_types" ADD CONSTRAINT "fk_license_types_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "license_types" ADD CONSTRAINT "fk_license_types_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organization_cards" ADD CONSTRAINT "fk_organization_cards_brand_id_card_brands" FOREIGN KEY ("brand_id") REFERENCES "card_brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organization_cards" ADD CONSTRAINT "fk_organization_cards_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organization_cards" ADD CONSTRAINT "fk_organization_cards_organization_id_organizations" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organization_mau_counts" ADD CONSTRAINT "fk_organization_mau_counts_organization_id_organizations" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organization_mau_counts" ADD CONSTRAINT "fk_organization_mau_counts_subscription_id_subscriptions" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organization_theme_settings" ADD CONSTRAINT "fk_organization_theme_settings_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organization_theme_settings" ADD CONSTRAINT "fk_organization_theme_settings_organization_id_organizations" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organization_theme_settings" ADD CONSTRAINT "fk_organization_theme_settings_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "fk_organizations_country_id_countries" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "fk_organizations_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "fk_organizations_currency_id_currencies" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "fk_organizations_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "fk_organizations_package_id_packages" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "fk_organizations_phone_country_id_countries" FOREIGN KEY ("phone_country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "fk_organizations_state_id_states" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "fk_organizations_timezone_id_timezones" FOREIGN KEY ("timezone_id") REFERENCES "timezones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "fk_organizations_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "otps" ADD CONSTRAINT "fk_otps_user_id_users" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "package_application_features" ADD CONSTRAINT "fk_package_application_features_application_id_applications" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "package_application_features" ADD CONSTRAINT "fk_package_application_features_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "package_application_features" ADD CONSTRAINT "fk_package_application_features_feature_id_features" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "package_application_features" ADD CONSTRAINT "fk_package_application_features_package_id_packages" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "package_application_features" ADD CONSTRAINT "fk_package_application_features_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "package_applications" ADD CONSTRAINT "fk_package_applications_application_id_applications" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "package_applications" ADD CONSTRAINT "fk_package_applications_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "package_applications" ADD CONSTRAINT "fk_package_applications_package_id_packages" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "package_applications" ADD CONSTRAINT "fk_package_applications_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "package_prices" ADD CONSTRAINT "fk_package_prices_currency_id_currencies" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "package_prices" ADD CONSTRAINT "fk_package_prices_interval_type_id_interval_types" FOREIGN KEY ("interval_type_id") REFERENCES "interval_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "package_prices" ADD CONSTRAINT "fk_package_prices_package_id_packages" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "fk_packages_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "fk_packages_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "fk_packages_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "permission_sub_features" ADD CONSTRAINT "fk_permission_sub_features_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "permission_sub_features" ADD CONSTRAINT "fk_permission_sub_features_role_id_roles" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "permission_sub_features" ADD CONSTRAINT "fk_permission_sub_features_sub_features_id_sub_features" FOREIGN KEY ("sub_features_id") REFERENCES "sub_features"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "permission_sub_features" ADD CONSTRAINT "fk_permission_sub_features_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_template_types" ADD CONSTRAINT "fk_product_tour_template_types_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_template_types" ADD CONSTRAINT "fk_product_tour_template_types_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_template_types" ADD CONSTRAINT "fk_product_tour_template_types_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_templates" ADD CONSTRAINT "fk_product_tour_templates_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_templates" ADD CONSTRAINT "fk_product_tour_templates_type_id_product_tour_template_types" FOREIGN KEY ("type_id") REFERENCES "product_tour_template_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_templates" ADD CONSTRAINT "fk_product_tour_templates_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchase_logs" ADD CONSTRAINT "fk_purchase_logs_addon_package_monthly_active_user_id_addon_pri" FOREIGN KEY ("addon_package_monthly_active_user_id") REFERENCES "addon_prices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchase_logs" ADD CONSTRAINT "fk_purchase_logs_addon_package_per_user_id_addon_prices" FOREIGN KEY ("addon_package_per_user_id") REFERENCES "addon_prices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchase_logs" ADD CONSTRAINT "fk_purchase_logs_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchase_logs" ADD CONSTRAINT "fk_purchase_logs_organization_id_organizations" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchase_logs" ADD CONSTRAINT "fk_purchase_logs_package_id_packages" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchase_logs" ADD CONSTRAINT "fk_purchase_logs_package_price_id_package_prices" FOREIGN KEY ("package_price_id") REFERENCES "package_prices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "restricted_sub_domains" ADD CONSTRAINT "fk_restricted_sub_domains_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "restricted_sub_domains" ADD CONSTRAINT "fk_restricted_sub_domains_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "restricted_sub_domains" ADD CONSTRAINT "fk_restricted_sub_domains_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "fk_roles_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "fk_roles_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "fk_roles_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "socket_organizations" ADD CONSTRAINT "fk_socket_organizations_organization_id_organizations" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "states" ADD CONSTRAINT "fk_states_country_id_countries" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "states" ADD CONSTRAINT "fk_states_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "states" ADD CONSTRAINT "fk_states_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "states" ADD CONSTRAINT "fk_states_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sub_features" ADD CONSTRAINT "fk_sub_features_feature_id_features" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sub_features" ADD CONSTRAINT "fk_sub_features_feature_type_id_feature_types" FOREIGN KEY ("feature_type_id") REFERENCES "feature_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sub_features" ADD CONSTRAINT "fk_sub_features_license_type_id_license_types" FOREIGN KEY ("license_type_id") REFERENCES "license_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "fk_subscriptions_additional_discount_id_additional_discounts" FOREIGN KEY ("additional_discount_id") REFERENCES "additional_discounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "fk_subscriptions_addon_package_monthly_active_user_id_addon_pri" FOREIGN KEY ("addon_package_monthly_active_user_id") REFERENCES "addon_prices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "fk_subscriptions_addon_package_per_user_id_addon_prices" FOREIGN KEY ("addon_package_per_user_id") REFERENCES "addon_prices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "fk_subscriptions_coupon_code_id_coupon_codes" FOREIGN KEY ("coupon_code_id") REFERENCES "coupon_codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "fk_subscriptions_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "fk_subscriptions_organization_id_organizations" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "fk_subscriptions_package_price_id_package_prices" FOREIGN KEY ("package_price_id") REFERENCES "package_prices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "fk_subscriptions_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_element_types" ADD CONSTRAINT "fk_survey_element_types_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_element_types" ADD CONSTRAINT "fk_survey_element_types_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_element_types" ADD CONSTRAINT "fk_survey_element_types_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_questions" ADD CONSTRAINT "fk_survey_questions_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_questions" ADD CONSTRAINT "fk_survey_questions_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_questions" ADD CONSTRAINT "fk_survey_questions_element_type_id_survey_element_types" FOREIGN KEY ("element_type_id") REFERENCES "survey_element_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_questions" ADD CONSTRAINT "fk_survey_questions_survey_id_surveys" FOREIGN KEY ("survey_id") REFERENCES "surveys"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_questions" ADD CONSTRAINT "fk_survey_questions_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_types" ADD CONSTRAINT "fk_survey_types_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_types" ADD CONSTRAINT "fk_survey_types_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_types" ADD CONSTRAINT "fk_survey_types_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "surveys" ADD CONSTRAINT "fk_surveys_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "surveys" ADD CONSTRAINT "fk_surveys_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "surveys" ADD CONSTRAINT "fk_surveys_type_id_survey_types" FOREIGN KEY ("type_id") REFERENCES "survey_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "surveys" ADD CONSTRAINT "fk_surveys_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_roles" ADD CONSTRAINT "fk_team_roles_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_roles" ADD CONSTRAINT "fk_team_roles_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_roles" ADD CONSTRAINT "fk_team_roles_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tenant_dbs" ADD CONSTRAINT "fk_tenant_dbs_account_id_organizations" FOREIGN KEY ("account_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tenant_dbs" ADD CONSTRAINT "fk_tenant_dbs_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tenant_dbs" ADD CONSTRAINT "fk_tenant_dbs_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tenant_dbs" ADD CONSTRAINT "fk_tenant_dbs_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ug_article_template" ADD CONSTRAINT "fk_ug_article_template_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ug_article_template" ADD CONSTRAINT "fk_ug_article_template_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ug_article_template" ADD CONSTRAINT "fk_ug_article_template_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_authentications" ADD CONSTRAINT "fk_user_authentications_default_organization_id_organizations" FOREIGN KEY ("default_organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_authentications" ADD CONSTRAINT "fk_user_authentications_user_id_users" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_login_sessions" ADD CONSTRAINT "fk_user_login_sessions_user_id_users" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_organizations" ADD CONSTRAINT "fk_user_organizations_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_organizations" ADD CONSTRAINT "fk_user_organizations_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_organizations" ADD CONSTRAINT "fk_user_organizations_organization_id_organizations" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_organizations" ADD CONSTRAINT "fk_user_organizations_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_organizations" ADD CONSTRAINT "fk_user_organizations_user_id_users" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_role_association" ADD CONSTRAINT "fk_user_role_association_role_id_roles" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_role_association" ADD CONSTRAINT "fk_user_role_association_user_id_users" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fk_users_country_id_countries" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fk_users_geo_zone_id_geo_zones" FOREIGN KEY ("geo_zone_id") REFERENCES "geo_zones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fk_users_language_id_languages" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fk_users_phone_country_id_countries" FOREIGN KEY ("phone_country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fk_users_timezone_id_timezones" FOREIGN KEY ("timezone_id") REFERENCES "timezones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
