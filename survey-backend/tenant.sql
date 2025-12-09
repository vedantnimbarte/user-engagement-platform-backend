-- CreateTable
CREATE TABLE "browsers" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(255),

    CONSTRAINT "browsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklist_congratulations_content_lives" (
    "checklist_id" UUID NOT NULL,
    "is_congratulations_content_visible" BOOLEAN NOT NULL DEFAULT false,
    "emoji" TEXT,
    "image_url" TEXT,
    "title" VARCHAR(50),
    "content" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "is_animation_enabled" BOOLEAN DEFAULT false
);

-- CreateTable
CREATE TABLE "checklist_congratulations_contents" (
    "checklist_id" UUID NOT NULL,
    "is_congratulations_content_visible" BOOLEAN NOT NULL DEFAULT false,
    "emoji" TEXT,
    "image_url" TEXT,
    "title" VARCHAR(50),
    "content" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "is_animation_enabled" BOOLEAN DEFAULT false
);

-- CreateTable
CREATE TABLE "checklist_item_lives" (
    "id" UUID NOT NULL,
    "checklist_id" UUID NOT NULL,
    "title" VARCHAR(255),
    "is_go_to_page_enabled" BOOLEAN NOT NULL DEFAULT true,
    "is_launch_flow_enabled" BOOLEAN NOT NULL DEFAULT false,
    "go_to_page_url" TEXT,
    "product_tour_id" UUID,
    "is_mark_completed_on_flow_start" BOOLEAN NOT NULL DEFAULT false,
    "is_mark_completed_on_condition" BOOLEAN NOT NULL DEFAULT false,
    "conditional_operator" VARCHAR(5),
    "checklist_item_conditions" JSON,
    "sort_order" SMALLINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,

    CONSTRAINT "checklist_item_live_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklist_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "checklist_id" UUID NOT NULL,
    "title" VARCHAR(255),
    "is_go_to_page_enabled" BOOLEAN NOT NULL DEFAULT true,
    "is_launch_flow_enabled" BOOLEAN NOT NULL DEFAULT false,
    "go_to_page_url" TEXT,
    "product_tour_id" UUID,
    "is_mark_completed_on_flow_start" BOOLEAN NOT NULL DEFAULT false,
    "is_mark_completed_on_condition" BOOLEAN NOT NULL DEFAULT false,
    "conditional_operator" VARCHAR(5),
    "checklist_item_conditions" JSON,
    "sort_order" SMALLINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,

    CONSTRAINT "checklist_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklist_lives" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "content_title" VARCHAR(50),
    "content_description" VARCHAR(60),
    "is_beacon_enabled" BOOLEAN NOT NULL DEFAULT true,
    "beacon_text" VARCHAR(30),
    "has_dismiss_link" BOOLEAN NOT NULL DEFAULT true,
    "prompt_text" VARCHAR(50),
    "cancel_button_text" VARCHAR(50),
    "confirm_button_text" VARCHAR(50),
    "is_segment_all_users" BOOLEAN NOT NULL DEFAULT true,
    "segment_id" UUID,
    "is_environment_all" BOOLEAN NOT NULL DEFAULT true,
    "selected_environments" JSON,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,
    "design" JSON,
    "is_anonymous_user" BOOLEAN,
    "is_identified_user" BOOLEAN,

    CONSTRAINT "checklist_live_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklist_trigger_lives" (
    "checklist_id" UUID NOT NULL,
    "is_all_pages" BOOLEAN NOT NULL DEFAULT true,
    "conditional_operator" VARCHAR(5),
    "checklist_trigger_conditions" JSON,
    "display_trigger_value" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "event_name" VARCHAR(255),
    "is_triggered_by_event" BOOLEAN DEFAULT false,
    "display_trigger" VARCHAR(255),

    CONSTRAINT "checklist_trigger_live_checklist_id_ukey" PRIMARY KEY ("checklist_id")
);

-- CreateTable
CREATE TABLE "checklist_triggers" (
    "checklist_id" UUID NOT NULL,
    "is_all_pages" BOOLEAN NOT NULL DEFAULT true,
    "conditional_operator" VARCHAR(5),
    "checklist_trigger_conditions" JSON,
    "display_trigger_value" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "event_name" VARCHAR(255),
    "is_triggered_by_event" BOOLEAN DEFAULT false,
    "display_trigger" VARCHAR(255),

    CONSTRAINT "checklist_trigger_checklist_id_ukey" PRIMARY KEY ("checklist_id")
);

-- CreateTable
CREATE TABLE "checklists" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "content_title" VARCHAR(50),
    "content_description" VARCHAR(60),
    "beacon_is_beacon_enabledstatus" BOOLEAN NOT NULL DEFAULT true,
    "beacon_text" VARCHAR(30),
    "has_dismiss_link" BOOLEAN NOT NULL DEFAULT true,
    "prompt_text" VARCHAR(50),
    "cancel_button_text" VARCHAR(50),
    "confirm_button_text" VARCHAR(50),
    "is_segment_all_users" BOOLEAN NOT NULL DEFAULT true,
    "segment_id" UUID,
    "is_environment_all" BOOLEAN NOT NULL DEFAULT true,
    "selected_environments" JSON,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,
    "design" JSON,
    "is_anonymous_user" BOOLEAN,
    "is_identified_user" BOOLEAN,

    CONSTRAINT "checklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "common" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" VARCHAR NOT NULL,
    "value" JSON,

    CONSTRAINT "common_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "calling_code" VARCHAR(10),
    "flag_url" VARCHAR(255),
    "code" VARCHAR(10),
    "flag_emoji_unicode" VARCHAR,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currencies" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(50),
    "symbol" VARCHAR(50),

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_types" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "key" VARCHAR(30) NOT NULL,
    "description" TEXT,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,

    CONSTRAINT "data_type_id_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demo_lives" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "page_width" INTEGER,
    "page_height" INTEGER,
    "branding_button_type" CHAR(255),
    "appearance" JSON,
    "branding_button" JSON,
    "link" TEXT,
    "original_media" JSON,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,

    CONSTRAINT "demo_live_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demo_processings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "demo_id" UUID NOT NULL,
    "video_url" TEXT,
    "mimetype" VARCHAR(255),
    "height" SMALLINT,
    "width" SMALLINT,
    "info" JSON,
    "status" SMALLINT NOT NULL DEFAULT 12,
    "processed_data" JSON,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "demo_processing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demo_step_hotspot_lives" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "demo_step_id" UUID NOT NULL,
    "demo_id" UUID NOT NULL,
    "hotspot_name" VARCHAR(255),
    "hotspot_info" JSON,
    "sort_order" SMALLINT NOT NULL,

    CONSTRAINT "demo_step_hotspot_live_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demo_step_hotspots" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "demo_step_id" UUID NOT NULL,
    "demo_id" UUID NOT NULL,
    "name" VARCHAR(255),
    "info" JSON,
    "sort_order" SMALLINT NOT NULL,

    CONSTRAINT "demo_step_hotspot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demo_step_lives" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "demo_id" UUID NOT NULL,
    "name" VARCHAR(255),
    "media_type" VARCHAR(255),
    "media_url" TEXT,
    "thumbnail_url" TEXT,
    "sort_order" SMALLINT,
    "overlay_info" JSON,
    "text_to_speech" JSON,
    "is_voiceover" BOOLEAN DEFAULT false,
    "video_start" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "video_end" DOUBLE PRECISION NOT NULL DEFAULT 1,

    CONSTRAINT "demo_step_live_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demo_steps" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "demo_id" UUID NOT NULL,
    "name" VARCHAR(255),
    "media_type" VARCHAR(255),
    "media_url" TEXT,
    "thumbnail_url" TEXT,
    "sort_order" SMALLINT,
    "overlay_info" JSON,
    "text_to_speech" JSON,
    "is_voiceover" BOOLEAN DEFAULT false,
    "video_start" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "video_end" DOUBLE PRECISION NOT NULL DEFAULT 1,

    CONSTRAINT "demo_step_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "page_width" INTEGER,
    "page_height" INTEGER,
    "branding_button_type" CHAR(255),
    "appearance" JSON,
    "branding_button" JSON,
    "link" TEXT,
    "original_media" JSON,
    "status" SMALLINT NOT NULL DEFAULT 4,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,

    CONSTRAINT "demo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "domains" (
    "id" SMALLSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,
    "is_script_installed" BOOLEAN DEFAULT false,
    "script_installed_at" TIMESTAMPTZ(6),
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "main_domain" VARCHAR,
    "sub_domain" VARCHAR,

    CONSTRAINT "domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_templates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "marketplace_template_id" UUID,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,

    CONSTRAINT "email_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_trackings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "event_id" INTEGER NOT NULL,
    "fired_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "domain_id" SMALLINT NOT NULL,
    "page_id" INTEGER,
    "event_data" JSONB,
    "session_started_at_fk" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "event_tracking_pkey" PRIMARY KEY ("domain_id","fired_at","id")
) PARTITION BY LIST ("domain_id");

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(20) NOT NULL DEFAULT 'custom',
    "configuration" JSONB,
    "base_event_id" INTEGER,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_types" (
    "id" UUID NOT NULL,
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
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "can_export" BOOLEAN DEFAULT false,
    "can_import" BOOLEAN DEFAULT false,

    CONSTRAINT "feature_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "features" (
    "id" UUID NOT NULL,
    "application_id" UUID,
    "key" VARCHAR,
    "status" SMALLINT,
    "limit" INTEGER,
    "name" VARCHAR,

    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "helper_group_item_lives" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "helper_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "sort_order" SMALLINT NOT NULL,
    "logo" VARCHAR,

    CONSTRAINT "helper_group_item_live_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "helper_group_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "helper_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "sort_order" SMALLINT NOT NULL,
    "logo" VARCHAR,

    CONSTRAINT "helper_group_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "helper_item_lives" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "helper_id" UUID NOT NULL,
    "group_item_id" UUID,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "sort_order" SMALLINT NOT NULL,
    "product_tour_id" UUID,
    "survey_id" UUID,
    "demo_id" UUID,
    "url" TEXT,
    "open_in_new_tab" BOOLEAN DEFAULT false,
    "logo" VARCHAR,

    CONSTRAINT "helper_item_live_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "helper_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "helper_id" UUID NOT NULL,
    "group_item_id" UUID,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "sort_order" SMALLINT NOT NULL,
    "product_tour_id" UUID,
    "survey_id" UUID,
    "demo_id" UUID,
    "url" TEXT,
    "open_in_new_tab" BOOLEAN DEFAULT false,
    "logo" VARCHAR,

    CONSTRAINT "helper_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "helper_lives" (
    "helper_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "logo" VARCHAR,
    "content_title" VARCHAR(255) NOT NULL,
    "content_description" VARCHAR(255),
    "is_for_all_users" BOOLEAN NOT NULL DEFAULT true,
    "segment_id" UUID,
    "domain_id" SMALLINT NOT NULL,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "design" JSON,
    "is_anonymous_user" BOOLEAN NOT NULL DEFAULT false,
    "is_identified_user" BOOLEAN NOT NULL DEFAULT false,
    "is_wildcard" BOOLEAN NOT NULL DEFAULT false,
    "remove_branding" BOOLEAN NOT NULL DEFAULT false,
    "hide_feature_icon" BOOLEAN NOT NULL DEFAULT false,
    "is_default_open" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,
    "bubble_text" TEXT,
    "disable_search" BOOLEAN DEFAULT false,

    CONSTRAINT "helper_live_pkey" PRIMARY KEY ("helper_id")
);

-- CreateTable
CREATE TABLE "helper_trigger_lives" (
    "helper_id" UUID NOT NULL,
    "trigger_by_event" BOOLEAN,
    "event_name" VARCHAR(255),

    CONSTRAINT "helper_trigger_live_pkey" PRIMARY KEY ("helper_id")
);

-- CreateTable
CREATE TABLE "helper_triggers" (
    "helper_id" UUID NOT NULL,
    "trigger_by_event" BOOLEAN,
    "event_name" VARCHAR(255),

    CONSTRAINT "helper_trigger_pkey" PRIMARY KEY ("helper_id")
);

-- CreateTable
CREATE TABLE "helpers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "logo" VARCHAR,
    "content_title" VARCHAR(255),
    "content_description" VARCHAR(255),
    "is_for_all_users" BOOLEAN NOT NULL DEFAULT true,
    "segment_id" UUID,
    "domain_id" SMALLINT,
    "status" SMALLINT NOT NULL DEFAULT 4,
    "design" JSON,
    "is_anonymous_user" BOOLEAN NOT NULL DEFAULT false,
    "is_identified_user" BOOLEAN NOT NULL DEFAULT false,
    "is_wildcard" BOOLEAN NOT NULL DEFAULT false,
    "remove_branding" BOOLEAN NOT NULL DEFAULT false,
    "hide_feature_icon" BOOLEAN NOT NULL DEFAULT false,
    "is_default_open" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,
    "bubble_text" TEXT,
    "disable_search" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "helper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "input_types" (
    "id" UUID NOT NULL,
    "type" VARCHAR(30),
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
CREATE TABLE "integrations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "status" SMALLINT NOT NULL DEFAULT 3,
    "data" JSON,
    "platform_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,

    CONSTRAINT "integration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kb_articles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "space_id" UUID NOT NULL,
    "parent_id" UUID,
    "sort_order" SMALLINT NOT NULL,
    "status" SMALLINT NOT NULL DEFAULT 4,
    "is_bookmarked" BOOLEAN DEFAULT false,
    "current_version_id" UUID,
    "link" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,

    CONSTRAINT "ug_article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kb_comments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "comment" VARCHAR(255),
    "article_id" UUID NOT NULL,
    "version_id" UUID NOT NULL,
    "line_number" SMALLINT,
    "start_position" SMALLINT,
    "end_position" SMALLINT,
    "is_resolved" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,

    CONSTRAINT "ug_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kb_space_users" (
    "user_id" UUID NOT NULL,
    "space_id" UUID NOT NULL,
    "role" SMALLINT NOT NULL,
    "last_login" TIMESTAMPTZ(6)
);

-- CreateTable
CREATE TABLE "kb_spaces" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "logo" VARCHAR,
    "status" SMALLINT NOT NULL DEFAULT 4,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,

    CONSTRAINT "ug_space_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kb_versions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "article_id" UUID NOT NULL,
    "collaborators" UUID[],
    "content_url" VARCHAR(255) NOT NULL,
    "content_hash" VARCHAR(255) NOT NULL,
    "mentions" UUID[],
    "status" SMALLINT NOT NULL DEFAULT 4,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,

    CONSTRAINT "ug_version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_libraries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "url" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(255) NOT NULL,
    "size" INTEGER NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "height" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "thumbnail_url" TEXT NOT NULL,
    "original_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_library_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operating_systems" (
    "id" SMALLSERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "operating_systems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "info" JSONB,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission_sub_features" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "role_id" UUID NOT NULL,
    "sub_feature_id" UUID NOT NULL,
    "can_create" BOOLEAN,
    "can_read" BOOLEAN,
    "can_update" BOOLEAN,
    "can_delete" BOOLEAN,
    "can_action" BOOLEAN,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "can_export" BOOLEAN,
    "can_import" BOOLEAN,

    CONSTRAINT "permission_sub_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_tour_lives" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "build_url" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "segment_id" UUID,
    "status" SMALLINT DEFAULT 1,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "is_for_all_users" BOOLEAN NOT NULL DEFAULT true,
    "is_for_anonymous_users" BOOLEAN NOT NULL DEFAULT false,
    "is_for_identified_users" BOOLEAN NOT NULL DEFAULT false,
    "has_progress_bar" BOOLEAN NOT NULL DEFAULT false,
    "progress_bar_type" VARCHAR(30),
    "progress_bar_position" VARCHAR(255),
    "progress_bar_color" VARCHAR(50),
    "is_wildcard" BOOLEAN DEFAULT false,
    "domain_id" SMALLINT,

    CONSTRAINT "product_tour_live_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_tour_steps" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_tour_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "index" SMALLINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "content" TEXT NOT NULL,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,
    "template_type_id" UUID,
    "url" TEXT,

    CONSTRAINT "product_tour_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_tour_steps_lives" (
    "id" UUID NOT NULL,
    "product_tour_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "index" SMALLINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "content" TEXT NOT NULL,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,
    "template_type_id" UUID,
    "url" TEXT,

    CONSTRAINT "product_tour_steps_live_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_tour_template_lives" (
    "name" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,
    "template_type_id" UUID,
    "id" UUID NOT NULL,

    CONSTRAINT "product_tour_template_live_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_tour_templates" (
    "name" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,
    "template_type_id" UUID,
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "product_tour_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_tour_trigger_lives" (
    "product_tour_id" UUID NOT NULL,
    "trigger_type" VARCHAR,
    "is_for_all_pages" BOOLEAN,
    "conditional_operator" VARCHAR,
    "conditions" JSON,
    "display_trigger_value" VARCHAR(255),
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "event_name" VARCHAR,
    "trigger_by_event" BOOLEAN NOT NULL DEFAULT false,
    "display_frequency" TEXT,
    "display_trigger" VARCHAR(255)
);

-- CreateTable
CREATE TABLE "product_tour_triggers" (
    "product_tour_id" UUID NOT NULL,
    "trigger_type" VARCHAR,
    "is_for_all_pages" BOOLEAN,
    "conditional_operator" VARCHAR,
    "conditions" JSON,
    "display_trigger_value" VARCHAR(255),
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "event_name" VARCHAR,
    "trigger_by_event" BOOLEAN NOT NULL DEFAULT false,
    "display_frequency" TEXT,
    "display_trigger" VARCHAR(255)
);

-- CreateTable
CREATE TABLE "product_tours" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "build_url" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "segment_id" UUID,
    "status" SMALLINT DEFAULT 1,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "is_for_all_users" BOOLEAN NOT NULL DEFAULT true,
    "is_for_anonymous_users" BOOLEAN NOT NULL DEFAULT false,
    "is_for_identified_users" BOOLEAN NOT NULL DEFAULT false,
    "has_progress_bar" BOOLEAN NOT NULL DEFAULT false,
    "progress_bar_type" VARCHAR(30),
    "progress_bar_position" VARCHAR(255),
    "progress_bar_color" VARCHAR(50),
    "is_wildcard" BOOLEAN DEFAULT false,
    "domain_id" SMALLINT,

    CONSTRAINT "product_tour_pkey" PRIMARY KEY ("id")
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
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "logo" TEXT,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "segments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "conditions" JSON[],
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,
    "type" VARCHAR(20),

    CONSTRAINT "segment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_page_views" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "page_id" INTEGER,
    "sort_order" INTEGER NOT NULL,
    "viewed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMPTZ(6),
    "time_spent" INTEGER,
    "session_id" UUID NOT NULL,
    "domain_id" SMALLINT NOT NULL,
    "session_started_at_fk" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "session_page_view_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "states" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "region_code" VARCHAR(20),

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_features" (
    "id" UUID NOT NULL,
    "feature_id" UUID,
    "key" VARCHAR,
    "feature_type_id" UUID,
    "status" SMALLINT,
    "name" VARCHAR,

    CONSTRAINT "sub_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_questions" (
    "id" SERIAL NOT NULL,
    "survey_id" INTEGER NOT NULL,
    "element_type" VARCHAR,
    "question" JSONB,
    "logic" JSONB,
    "setting" JSONB,
    "other" JSONB,
    "sort_order" SMALLINT,
    "status" SMALLINT DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,

    CONSTRAINT "survey_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surveys" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" VARCHAR,
    "status" SMALLINT DEFAULT 1,
    "type" VARCHAR,
    "design" JSONB,
    "target" JSONB,
    "trigger" JSONB,
    "other" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,

    CONSTRAINT "surveys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "theme_settings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "theme" VARCHAR NOT NULL,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "custom_css" JSON,
    "survey" JSON,
    "product_tour" JSON,
    "checklist" JSON,
    "demoz" JSON,
    "helper" JSON,

    CONSTRAINT "theme_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timezones" (
    "id" SMALLSERIAL NOT NULL,
    "timezone" VARCHAR(100) NOT NULL,
    "offset" INTEGER NOT NULL,
    "code" VARCHAR(100),

    CONSTRAINT "timezones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "up_attributes" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "key" VARCHAR(30) NOT NULL,
    "data_type_id" SMALLINT,
    "description" TEXT,
    "is_system_attribute" BOOLEAN,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,
    "reference_table" TEXT,

    CONSTRAINT "attribute_id_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_feature_progresses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" VARCHAR(255) NOT NULL,
    "user_type" VARCHAR(20) NOT NULL,
    "feature_type" VARCHAR(50) NOT NULL,
    "feature_id" UUID NOT NULL,
    "progress" JSON NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),

    CONSTRAINT "user_feature_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_progress_checklist_lives" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" VARCHAR(255) NOT NULL,
    "user_type" VARCHAR(20) NOT NULL,
    "checklist_id" UUID NOT NULL,
    "progress" JSON NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),
    "dismissed_at" TIMESTAMPTZ(6),
    "status" SMALLINT NOT NULL DEFAULT 1,
    "domain_id" SMALLINT,
    "session_id" UUID,

    CONSTRAINT "user_progress_checklist_live_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_progress_checklists" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" VARCHAR(255) NOT NULL,
    "user_type" VARCHAR(20) NOT NULL,
    "checklist_id" UUID NOT NULL,
    "progress" JSON NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),
    "dismissed_at" TIMESTAMPTZ(6),
    "status" SMALLINT NOT NULL DEFAULT 1,
    "domain_id" SMALLINT,
    "session_id" UUID,

    CONSTRAINT "user_progress_checklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_progress_demo_lives" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" VARCHAR(255) NOT NULL,
    "user_type" VARCHAR(255) NOT NULL,
    "demo_id" UUID NOT NULL,
    "step_progress" JSON,
    "hotspot_progress" JSON,
    "branding_count" SMALLINT NOT NULL DEFAULT 0,
    "is_replay" BOOLEAN NOT NULL DEFAULT false,
    "viewport_enter_at" TIMESTAMPTZ(6),
    "viewport_exit_at" TIMESTAMPTZ(6),
    "play_time" SMALLINT NOT NULL DEFAULT 0,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "played_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "cta_progress" JSON,
    "domain_id" SMALLINT,
    "channel" SMALLINT,
    "full_screen_enter" SMALLINT NOT NULL DEFAULT 0,
    "full_screen_exit" SMALLINT NOT NULL DEFAULT 0,
    "session_id" UUID,

    CONSTRAINT "user_progress_demo_live_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_progress_demos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" VARCHAR(255) NOT NULL,
    "user_type" VARCHAR(255) NOT NULL,
    "demo_id" UUID NOT NULL,
    "step_progress" JSON,
    "hotspot_progress" JSON,
    "branding_count" SMALLINT NOT NULL DEFAULT 0,
    "is_replay" BOOLEAN NOT NULL DEFAULT false,
    "viewport_enter_at" TIMESTAMPTZ(6),
    "viewport_exit_at" TIMESTAMPTZ(6),
    "play_time" SMALLINT NOT NULL DEFAULT 0,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "played_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "cta_progress" JSON,
    "domain_id" SMALLINT,
    "channel" SMALLINT,
    "full_screen_enter" SMALLINT NOT NULL DEFAULT 0,
    "full_screen_exit" SMALLINT NOT NULL DEFAULT 0,
    "session_id" UUID,

    CONSTRAINT "user_progress_demo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_progress_helper_lives" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" VARCHAR(255) NOT NULL,
    "user_type" VARCHAR(20) NOT NULL,
    "helper_id" UUID NOT NULL,
    "item_progress" JSON,
    "search_terms" JSON,
    "launch_count" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "channel" SMALLINT,
    "domain_id" SMALLINT,
    "launched_at" TIMESTAMPTZ(6),
    "error_count" SMALLINT DEFAULT 0,

    CONSTRAINT "user_progress_helper_live_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_progress_helpers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" VARCHAR(255) NOT NULL,
    "user_type" VARCHAR(20) NOT NULL,
    "helper_id" UUID NOT NULL,
    "item_progress" JSON,
    "search_terms" JSON,
    "launch_count" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "channel" SMALLINT,
    "domain_id" SMALLINT,
    "launched_at" TIMESTAMPTZ(6),
    "session_id" UUID,
    "error_count" SMALLINT DEFAULT 0,

    CONSTRAINT "user_progress_helper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_progress_product_tour_lives" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" VARCHAR(255) NOT NULL,
    "user_type" VARCHAR(20) NOT NULL,
    "product_tour_id" UUID NOT NULL,
    "progress" JSON NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),
    "dismissed_at" TIMESTAMPTZ(6),
    "status" SMALLINT NOT NULL DEFAULT 1,
    "domain_id" SMALLINT,
    "session_id" UUID,

    CONSTRAINT "user_progress_product_tour_live_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_progress_product_tours" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" VARCHAR(255) NOT NULL,
    "user_type" VARCHAR(20) NOT NULL,
    "product_tour_id" UUID NOT NULL,
    "progress" JSON NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),
    "dismissed_at" TIMESTAMPTZ(6),
    "status" SMALLINT NOT NULL DEFAULT 1,
    "domain_id" SMALLINT,
    "session_id" UUID,

    CONSTRAINT "user_progress_product_tour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role_associations" (
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "user_session_activities" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "started_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMPTZ(6),
    "is_first_visit" BOOLEAN,
    "tab_language" VARCHAR,
    "geo_location" JSON,
    "session_information" JSON,
    "latitude" VARCHAR(60),
    "longitude" VARCHAR(60),
    "continent" VARCHAR(60),
    "city" VARCHAR(60),
    "state_id" UUID,
    "zipcode" INTEGER,
    "timezone_id" SMALLINT,
    "ip_address" VARCHAR(50),
    "socket_id" TEXT,
    "channel" SMALLINT DEFAULT 1,
    "domain_id" SMALLINT NOT NULL,
    "device_type" VARCHAR(255),
    "browser_id" SMALLINT,
    "country_id" SMALLINT,
    "currency_id" SMALLINT,
    "entrance_page_id" SMALLINT,
    "exit_page_id" SMALLINT,
    "operating_system_id" SMALLINT,
    "session_state" SMALLINT,
    "user_id" UUID,
    "browser_language_id" SMALLINT,
    "referral_url" TEXT,
    "referral_domain" TEXT,
    "idle_at" TIMESTAMPTZ(6),
    "idle_time" SMALLINT,
    "other_info" JSONB,
    "user_created_at_fk" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_session_activity_pkey" PRIMARY KEY ("domain_id","started_at","id")
) PARTITION BY LIST ("domain_id");

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "first_name" VARCHAR(99),
    "last_name" VARCHAR(99),
    "email" VARCHAR(60) NOT NULL,
    "profile_picture_url" TEXT,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMPTZ(6),
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,
    "default_role_id" UUID,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "browser_languages" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(255),

    CONSTRAINT "browser_languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracked_users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tracked_id" VARCHAR(50) NOT NULL,
    "user_type" VARCHAR(25) NOT NULL,
    "channel" SMALLINT DEFAULT 1,
    "domain_id" SMALLINT NOT NULL,
    "zip" VARCHAR(50),
    "city" VARCHAR(255),
    "browser_id" SMALLINT,
    "country_id" SMALLINT,
    "currency_id" SMALLINT,
    "operating_system_id" SMALLINT,
    "latitude" VARCHAR(255),
    "longitude" VARCHAR(255),
    "timezone_id" SMALLINT,
    "ip_address" VARCHAR(255),
    "device_type" VARCHAR(255),
    "region_name" VARCHAR(255),
    "referral_url" TEXT,
    "referral_domain" VARCHAR(255),
    "user_status" SMALLINT,
    "continent" VARCHAR(255),
    "user_details" JSONB,
    "other_info" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMPTZ(6),

    CONSTRAINT "user_tracked_data_pkey" PRIMARY KEY ("domain_id","created_at","id")
) PARTITION BY LIST ("domain_id");

-- CreateTable
CREATE TABLE "segment_users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "segment_id" UUID,
    "user_id" UUID,
    "user_created_at_fk" TIMESTAMPTZ(6) NOT NULL,
    "domain_id" SMALLINT NOT NULL,

    CONSTRAINT "segment_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_response_answers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "survey_response_id" UUID NOT NULL,
    "survey_question_id" INTEGER NOT NULL,
    "answer" JSONB,
    "skipped" BOOLEAN,
    "survey_dismissed" BOOLEAN,
    "other" JSONB,

    CONSTRAINT "survey_response_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_responses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "survey_id" INTEGER,
    "is_completed" BOOLEAN DEFAULT false,
    "is_dismissed" BOOLEAN DEFAULT false,
    "completed_count" SMALLINT DEFAULT 0,
    "skipped_count" SMALLINT DEFAULT 0,
    "completed_at" TIMESTAMPTZ(6),
    "dismissed_at" TIMESTAMPTZ(6),
    "started_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "status" SMALLINT DEFAULT 1,
    "channel" SMALLINT,
    "domain_id" INTEGER,
    "session_id" UUID,
    "session_started_at_fk" TIMESTAMPTZ(6),
    "user_created_at_fk" TIMESTAMPTZ(6),

    CONSTRAINT "survey_responses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ukey_checklist_congratulations_content_lives_checklist" ON "checklist_congratulations_content_lives"("checklist_id");

-- CreateIndex
CREATE UNIQUE INDEX "ukey_checklist_congratulations_contents_checklist" ON "checklist_congratulations_contents"("checklist_id");

-- CreateIndex
CREATE INDEX "idx_checklist_item_lives_checklist_id" ON "checklist_item_lives"("checklist_id");

-- CreateIndex
CREATE INDEX "idx_checklist_items_checklist_id" ON "checklist_items"("checklist_id");

-- CreateIndex
CREATE INDEX "idx_checklist_lives_status" ON "checklist_lives"("status");

-- CreateIndex
CREATE INDEX "idx_checklists_status" ON "checklists"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ukey_data_types_name" ON "data_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ukey_data_types_key" ON "data_types"("key");

-- CreateIndex
CREATE INDEX "idx_domains_is_system" ON "domains"("is_system");

-- CreateIndex
CREATE INDEX "idx_domains_status" ON "domains"("status");

-- CreateIndex
CREATE INDEX "idx_event_trackings_event_id" ON "event_trackings"("event_id");

-- CreateIndex
CREATE INDEX "idx_event_trackings_session_id" ON "event_trackings"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_tracking_ukey" ON "event_trackings"("domain_id", "fired_at", "id");

-- CreateIndex
CREATE UNIQUE INDEX "ukey_feature_types_name" ON "feature_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ukey_input_types_type" ON "input_types"("type");

-- CreateIndex
CREATE UNIQUE INDEX "ukey_input_types_key" ON "input_types"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ukey_integrations_platform_id" ON "integrations"("platform_id");

-- CreateIndex
CREATE UNIQUE INDEX "ukey_kb_space_users_user_id_space_id" ON "kb_space_users"("user_id", "space_id");

-- CreateIndex
CREATE UNIQUE INDEX "ukey_operating_systems_name" ON "operating_systems"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ukey_pages_url" ON "pages"("url");

-- CreateIndex
CREATE INDEX "idx_product_tour_lives_created_at" ON "product_tour_lives"("created_at");

-- CreateIndex
CREATE INDEX "idx_product_tour_lives_status" ON "product_tour_lives"("status");

-- CreateIndex
CREATE INDEX "idx_product_tour_steps_product_tour_id" ON "product_tour_steps"("product_tour_id");

-- CreateIndex
CREATE INDEX "idx_product_tour_steps_lives_product_tour_id" ON "product_tour_steps_lives"("product_tour_id");

-- CreateIndex
CREATE UNIQUE INDEX "ukey_product_tour_trigger_lives_product_tour_id" ON "product_tour_trigger_lives"("product_tour_id");

-- CreateIndex
CREATE UNIQUE INDEX "ukey_product_tour_triggers_product_tour_id" ON "product_tour_triggers"("product_tour_id");

-- CreateIndex
CREATE INDEX "idx_product_tours_created_at" ON "product_tours"("created_at");

-- CreateIndex
CREATE INDEX "idx_product_tours_status" ON "product_tours"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ukey_roles_name" ON "roles"("name");

-- CreateIndex
CREATE INDEX "idx_sub_features_feature_id" ON "sub_features"("feature_id");

-- CreateIndex
CREATE INDEX "idx_sub_features_feature_type_id" ON "sub_features"("feature_type_id");

-- CreateIndex
CREATE INDEX "fki_created_by" ON "survey_questions"("updated_by");

-- CreateIndex
CREATE INDEX "fki_fk_survey_questions_created_by" ON "survey_questions"("created_by");

-- CreateIndex
CREATE INDEX "fki_fk_survey_questions_deleted_by" ON "survey_questions"("deleted_by");

-- CreateIndex
CREATE INDEX "fki_fk_survey_questions_survey_id" ON "survey_questions"("survey_id");

-- CreateIndex
CREATE INDEX "fki_fk_survey_user_deleted_by" ON "surveys"("deleted_by");

-- CreateIndex
CREATE INDEX "fki_survey_user_updated_by" ON "surveys"("updated_by");

-- CreateIndex
CREATE INDEX "fki_syrvey" ON "surveys"("created_by");

-- CreateIndex
CREATE UNIQUE INDEX "ukey_up_attributes_name" ON "up_attributes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ukey_up_attributes_key" ON "up_attributes"("key");

-- CreateIndex
CREATE INDEX "idx_user_progress_checklists_checklist_id" ON "user_progress_checklists"("checklist_id");

-- CreateIndex
CREATE INDEX "idx_user_progress_checklists_completed_at" ON "user_progress_checklists"("completed_at");

-- CreateIndex
CREATE INDEX "idx_user_progress_checklists_created_at" ON "user_progress_checklists"("created_at");

-- CreateIndex
CREATE INDEX "idx_user_progress_checklists_dismissed_at" ON "user_progress_checklists"("dismissed_at");

-- CreateIndex
CREATE INDEX "idx_user_progress_checklists_domain_id" ON "user_progress_checklists"("domain_id");

-- CreateIndex
CREATE INDEX "idx_user_progress_checklists_user_id" ON "user_progress_checklists"("user_id");

-- CreateIndex
CREATE INDEX "idx_user_progress_product_tours_completed_at" ON "user_progress_product_tours"("completed_at");

-- CreateIndex
CREATE INDEX "idx_user_progress_product_tours_created_at" ON "user_progress_product_tours"("created_at");

-- CreateIndex
CREATE INDEX "idx_user_progress_product_tours_dismissed_at" ON "user_progress_product_tours"("dismissed_at");

-- CreateIndex
CREATE INDEX "idx_user_progress_product_tours_domain_id" ON "user_progress_product_tours"("domain_id");

-- CreateIndex
CREATE INDEX "idx_user_progress_product_tours_product_tour_id" ON "user_progress_product_tours"("product_tour_id");

-- CreateIndex
CREATE INDEX "idx_user_progress_product_tours_user_id" ON "user_progress_product_tours"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ukey_user_role_associations_user_id_role_id" ON "user_role_associations"("user_id", "role_id");

-- CreateIndex
CREATE INDEX "idx_user_session_activities_channel" ON "user_session_activities"("channel");

-- CreateIndex
CREATE UNIQUE INDEX "user_session_activity_ukey" ON "user_session_activities"("domain_id", "started_at", "id");

-- CreateIndex
CREATE INDEX "idx_user_tracked_datas_user_id" ON "tracked_users"("tracked_id");

-- CreateIndex
CREATE INDEX "idx_user_tracked_datas_user_type" ON "tracked_users"("user_type");

-- CreateIndex
CREATE UNIQUE INDEX "user_tracked_data_ukey" ON "tracked_users"("domain_id", "created_at", "id");

-- CreateIndex
CREATE INDEX "fki_fk_survey_question_id" ON "survey_response_answers"("survey_question_id");

-- CreateIndex
CREATE INDEX "fki_fk_survey_response_id" ON "survey_response_answers"("survey_response_id");

-- CreateIndex
CREATE INDEX "fki_fk_survey_responses_survey_id" ON "survey_responses"("survey_id");

-- AddForeignKey
ALTER TABLE "checklist_congratulations_content_lives" ADD CONSTRAINT "fk_checklist_congratulations_content_lives_checklist_id_checkli" FOREIGN KEY ("checklist_id") REFERENCES "checklist_lives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklist_congratulations_content_lives" ADD CONSTRAINT "fk_checklist_congratulations_content_lives_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklist_congratulations_content_lives" ADD CONSTRAINT "fk_checklist_congratulations_content_lives_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklist_congratulations_contents" ADD CONSTRAINT "fk_checklist_congratulations_contents_checklist_id_checklists" FOREIGN KEY ("checklist_id") REFERENCES "checklists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklist_congratulations_contents" ADD CONSTRAINT "fk_checklist_congratulations_contents_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklist_congratulations_contents" ADD CONSTRAINT "fk_checklist_congratulations_contents_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklist_item_lives" ADD CONSTRAINT "fk_checklist_item_lives_checklist_id_checklist_lives" FOREIGN KEY ("checklist_id") REFERENCES "checklist_lives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklist_item_lives" ADD CONSTRAINT "fk_checklist_item_lives_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklist_item_lives" ADD CONSTRAINT "fk_checklist_item_lives_product_tour_id_product_tour_lives" FOREIGN KEY ("product_tour_id") REFERENCES "product_tour_lives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklist_item_lives" ADD CONSTRAINT "fk_checklist_item_lives_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklist_items" ADD CONSTRAINT "fk_checklist_items_checklist_id_checklists" FOREIGN KEY ("checklist_id") REFERENCES "checklists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklist_items" ADD CONSTRAINT "fk_checklist_items_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklist_items" ADD CONSTRAINT "fk_checklist_items_product_tour_id_product_tours" FOREIGN KEY ("product_tour_id") REFERENCES "product_tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklist_items" ADD CONSTRAINT "fk_checklist_items_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklist_lives" ADD CONSTRAINT "fk_checklist_lives_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklist_lives" ADD CONSTRAINT "fk_checklist_lives_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklist_lives" ADD CONSTRAINT "fk_checklist_lives_segment_id_segments" FOREIGN KEY ("segment_id") REFERENCES "segments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklist_lives" ADD CONSTRAINT "fk_checklist_lives_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklist_trigger_lives" ADD CONSTRAINT "fk_checklist_trigger_lives_checklist_id_checklist_lives" FOREIGN KEY ("checklist_id") REFERENCES "checklist_lives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklist_trigger_lives" ADD CONSTRAINT "fk_checklist_trigger_lives_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklist_trigger_lives" ADD CONSTRAINT "fk_checklist_trigger_lives_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklist_triggers" ADD CONSTRAINT "fk_checklist_triggers_checklist_id_checklists" FOREIGN KEY ("checklist_id") REFERENCES "checklists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklist_triggers" ADD CONSTRAINT "fk_checklist_triggers_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklist_triggers" ADD CONSTRAINT "fk_checklist_triggers_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklists" ADD CONSTRAINT "fk_checklists_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklists" ADD CONSTRAINT "fk_checklists_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklists" ADD CONSTRAINT "fk_checklists_segment_id_segments" FOREIGN KEY ("segment_id") REFERENCES "segments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklists" ADD CONSTRAINT "fk_checklists_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "data_types" ADD CONSTRAINT "fk_data_types_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "data_types" ADD CONSTRAINT "fk_data_types_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "data_types" ADD CONSTRAINT "fk_data_types_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "demo_lives" ADD CONSTRAINT "fk_demo_lives_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "demo_lives" ADD CONSTRAINT "fk_demo_lives_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "demo_lives" ADD CONSTRAINT "fk_demo_lives_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "demo_processings" ADD CONSTRAINT "fk_demo_processings_demo_id_demos" FOREIGN KEY ("demo_id") REFERENCES "demos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "demo_step_hotspot_lives" ADD CONSTRAINT "fk_demo_step_hotspot_lives_demo_id_demo_lives" FOREIGN KEY ("demo_id") REFERENCES "demo_lives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "demo_step_hotspot_lives" ADD CONSTRAINT "fk_demo_step_hotspot_lives_demo_step_id_demo_step_lives" FOREIGN KEY ("demo_step_id") REFERENCES "demo_step_lives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "demo_step_hotspots" ADD CONSTRAINT "fk_demo_step_hotspots_demo_id_demos" FOREIGN KEY ("demo_id") REFERENCES "demos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "demo_step_hotspots" ADD CONSTRAINT "fk_demo_step_hotspots_demo_step_id_demo_steps" FOREIGN KEY ("demo_step_id") REFERENCES "demo_steps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "demo_step_lives" ADD CONSTRAINT "fk_demo_step_lives_demo_id_demo_lives" FOREIGN KEY ("demo_id") REFERENCES "demo_lives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "demo_steps" ADD CONSTRAINT "fk_demo_steps_demo_id_demos" FOREIGN KEY ("demo_id") REFERENCES "demos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "demos" ADD CONSTRAINT "fk_demos_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "demos" ADD CONSTRAINT "fk_demos_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "demos" ADD CONSTRAINT "fk_demos_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "domains" ADD CONSTRAINT "fk_domains_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "domains" ADD CONSTRAINT "fk_domains_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "domains" ADD CONSTRAINT "fk_domains_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "email_templates" ADD CONSTRAINT "fk_email_templates_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "email_templates" ADD CONSTRAINT "fk_email_templates_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "email_templates" ADD CONSTRAINT "fk_email_templates_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_trackings" ADD CONSTRAINT "fk_event_trackings_domain_id_domains" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_trackings" ADD CONSTRAINT "fk_event_trackings_event_id_events" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_trackings" ADD CONSTRAINT "fk_event_trackings_page_id_pages" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_trackings" ADD CONSTRAINT "fk_event_trackings_session_id_user_session_activities" FOREIGN KEY ("domain_id", "session_started_at_fk", "session_id") REFERENCES "user_session_activities"("domain_id", "started_at", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feature_types" ADD CONSTRAINT "fk_feature_types_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feature_types" ADD CONSTRAINT "fk_feature_types_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feature_types" ADD CONSTRAINT "fk_feature_types_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helper_group_item_lives" ADD CONSTRAINT "fk_helper_group_item_lives_helper_id_helper_lives" FOREIGN KEY ("helper_id") REFERENCES "helper_lives"("helper_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helper_group_items" ADD CONSTRAINT "fk_helper_group_items_helper_id_helpers" FOREIGN KEY ("helper_id") REFERENCES "helpers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helper_item_lives" ADD CONSTRAINT "fk_helper_item_lives_demo_id_demo_lives" FOREIGN KEY ("demo_id") REFERENCES "demo_lives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helper_item_lives" ADD CONSTRAINT "fk_helper_item_lives_group_item_id_helper_group_item_lives" FOREIGN KEY ("group_item_id") REFERENCES "helper_group_item_lives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helper_item_lives" ADD CONSTRAINT "fk_helper_item_lives_helper_id_helper_lives" FOREIGN KEY ("helper_id") REFERENCES "helper_lives"("helper_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helper_item_lives" ADD CONSTRAINT "fk_helper_item_lives_product_tour_id_product_tour_lives" FOREIGN KEY ("product_tour_id") REFERENCES "product_tour_lives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helper_items" ADD CONSTRAINT "fk_helper_items_demo_id_demo_lives" FOREIGN KEY ("demo_id") REFERENCES "demo_lives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helper_items" ADD CONSTRAINT "fk_helper_items_group_item_id_helper_group_items" FOREIGN KEY ("group_item_id") REFERENCES "helper_group_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helper_items" ADD CONSTRAINT "fk_helper_items_helper_id_helpers" FOREIGN KEY ("helper_id") REFERENCES "helpers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helper_items" ADD CONSTRAINT "fk_helper_items_product_tour_id_product_tour_lives" FOREIGN KEY ("product_tour_id") REFERENCES "product_tour_lives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helper_lives" ADD CONSTRAINT "fk_helper_lives_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helper_lives" ADD CONSTRAINT "fk_helper_lives_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helper_lives" ADD CONSTRAINT "fk_helper_lives_domain_id_domains" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helper_lives" ADD CONSTRAINT "fk_helper_lives_segment_id_segments" FOREIGN KEY ("segment_id") REFERENCES "segments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helper_lives" ADD CONSTRAINT "fk_helper_lives_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helper_trigger_lives" ADD CONSTRAINT "fk_helper_trigger_lives_helper_id_helper_lives" FOREIGN KEY ("helper_id") REFERENCES "helper_lives"("helper_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helper_triggers" ADD CONSTRAINT "fk_helper_triggers_helper_id_helpers" FOREIGN KEY ("helper_id") REFERENCES "helpers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helpers" ADD CONSTRAINT "fk_helpers_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helpers" ADD CONSTRAINT "fk_helpers_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helpers" ADD CONSTRAINT "fk_helpers_domain_id_domains" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helpers" ADD CONSTRAINT "fk_helpers_segment_id_segments" FOREIGN KEY ("segment_id") REFERENCES "segments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helpers" ADD CONSTRAINT "fk_helpers_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "input_types" ADD CONSTRAINT "fk_input_types_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "input_types" ADD CONSTRAINT "fk_input_types_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "input_types" ADD CONSTRAINT "fk_input_types_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "integrations" ADD CONSTRAINT "fk_integrations_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "integrations" ADD CONSTRAINT "fk_integrations_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "integrations" ADD CONSTRAINT "fk_integrations_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kb_articles" ADD CONSTRAINT "fk_kb_articles_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kb_articles" ADD CONSTRAINT "fk_kb_articles_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kb_articles" ADD CONSTRAINT "fk_kb_articles_parent_id_kb_articles" FOREIGN KEY ("parent_id") REFERENCES "kb_articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kb_articles" ADD CONSTRAINT "fk_kb_articles_space_id_kb_spaces" FOREIGN KEY ("space_id") REFERENCES "kb_spaces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kb_articles" ADD CONSTRAINT "fk_kb_articles_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kb_comments" ADD CONSTRAINT "fk_kb_comments_article_id_kb_articles" FOREIGN KEY ("article_id") REFERENCES "kb_articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kb_comments" ADD CONSTRAINT "fk_kb_comments_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kb_comments" ADD CONSTRAINT "fk_kb_comments_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kb_comments" ADD CONSTRAINT "fk_kb_comments_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kb_comments" ADD CONSTRAINT "fk_kb_comments_version_id_kb_versions" FOREIGN KEY ("version_id") REFERENCES "kb_versions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kb_space_users" ADD CONSTRAINT "fk_kb_space_users_space_id_kb_spaces" FOREIGN KEY ("space_id") REFERENCES "kb_spaces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kb_space_users" ADD CONSTRAINT "fk_kb_space_users_user_id_users" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kb_spaces" ADD CONSTRAINT "fk_kb_spaces_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kb_spaces" ADD CONSTRAINT "fk_kb_spaces_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kb_spaces" ADD CONSTRAINT "fk_kb_spaces_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kb_versions" ADD CONSTRAINT "fk_kb_versions_article_id_kb_articles" FOREIGN KEY ("article_id") REFERENCES "kb_articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kb_versions" ADD CONSTRAINT "fk_kb_versions_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "permission_sub_features" ADD CONSTRAINT "fk_permission_sub_features_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "permission_sub_features" ADD CONSTRAINT "fk_permission_sub_features_role_id_roles" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "permission_sub_features" ADD CONSTRAINT "fk_permission_sub_features_sub_feature_id_sub_features" FOREIGN KEY ("sub_feature_id") REFERENCES "sub_features"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_lives" ADD CONSTRAINT "fk_product_tour_lives_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_lives" ADD CONSTRAINT "fk_product_tour_lives_domain_id_domains" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_lives" ADD CONSTRAINT "fk_product_tour_lives_segment_id_segments" FOREIGN KEY ("segment_id") REFERENCES "segments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_lives" ADD CONSTRAINT "fk_product_tour_lives_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_steps" ADD CONSTRAINT "fk_product_tour_steps_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_steps" ADD CONSTRAINT "fk_product_tour_steps_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_steps" ADD CONSTRAINT "fk_product_tour_steps_product_tour_id_product_tours" FOREIGN KEY ("product_tour_id") REFERENCES "product_tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_steps" ADD CONSTRAINT "fk_product_tour_steps_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_steps_lives" ADD CONSTRAINT "fk_product_tour_steps_lives_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_steps_lives" ADD CONSTRAINT "fk_product_tour_steps_lives_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_steps_lives" ADD CONSTRAINT "fk_product_tour_steps_lives_product_tour_id_product_tour_lives" FOREIGN KEY ("product_tour_id") REFERENCES "product_tour_lives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_steps_lives" ADD CONSTRAINT "fk_product_tour_steps_lives_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_template_lives" ADD CONSTRAINT "fk_product_tour_template_lives_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_template_lives" ADD CONSTRAINT "fk_product_tour_template_lives_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_template_lives" ADD CONSTRAINT "fk_product_tour_template_lives_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_templates" ADD CONSTRAINT "fk_product_tour_templates_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_templates" ADD CONSTRAINT "fk_product_tour_templates_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_templates" ADD CONSTRAINT "fk_product_tour_templates_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_trigger_lives" ADD CONSTRAINT "fk_product_tour_trigger_lives_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_trigger_lives" ADD CONSTRAINT "fk_product_tour_trigger_lives_product_tour_id_product_tour_live" FOREIGN KEY ("product_tour_id") REFERENCES "product_tour_lives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_trigger_lives" ADD CONSTRAINT "fk_product_tour_trigger_lives_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_triggers" ADD CONSTRAINT "fk_product_tour_triggers_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_triggers" ADD CONSTRAINT "fk_product_tour_triggers_product_tour_id_product_tours" FOREIGN KEY ("product_tour_id") REFERENCES "product_tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tour_triggers" ADD CONSTRAINT "fk_product_tour_triggers_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tours" ADD CONSTRAINT "fk_product_tours_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tours" ADD CONSTRAINT "fk_product_tours_domain_id_domains" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tours" ADD CONSTRAINT "fk_product_tours_segment_id_segments" FOREIGN KEY ("segment_id") REFERENCES "segments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_tours" ADD CONSTRAINT "fk_product_tours_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "fk_roles_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "fk_roles_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "fk_roles_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "segments" ADD CONSTRAINT "fk_segments_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "segments" ADD CONSTRAINT "fk_segments_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "segments" ADD CONSTRAINT "fk_segments_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "session_page_views" ADD CONSTRAINT "fk_session_page_views_page_id_pages" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "session_page_views" ADD CONSTRAINT "fk_session_page_views_session_id_user_session_activities" FOREIGN KEY ("domain_id", "session_started_at_fk", "session_id") REFERENCES "user_session_activities"("domain_id", "started_at", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sub_features" ADD CONSTRAINT "fk_sub_features_feature_id_features" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sub_features" ADD CONSTRAINT "fk_sub_features_feature_type_id_feature_types" FOREIGN KEY ("feature_type_id") REFERENCES "feature_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_questions" ADD CONSTRAINT "fk_survey_questions_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_questions" ADD CONSTRAINT "fk_survey_questions_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_questions" ADD CONSTRAINT "fk_survey_questions_survey_id_surveys" FOREIGN KEY ("survey_id") REFERENCES "surveys"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_questions" ADD CONSTRAINT "fk_survey_questions_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "surveys" ADD CONSTRAINT "fk_survey_user_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "surveys" ADD CONSTRAINT "fk_survey_user_deleted_by" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "surveys" ADD CONSTRAINT "fk_survey_user_updated_by" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "up_attributes" ADD CONSTRAINT "fk_up_attributes_created_by_users" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "up_attributes" ADD CONSTRAINT "fk_up_attributes_data_type_id_data_types" FOREIGN KEY ("data_type_id") REFERENCES "data_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "up_attributes" ADD CONSTRAINT "fk_up_attributes_deleted_by_users" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "up_attributes" ADD CONSTRAINT "fk_up_attributes_updated_by_users" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_progress_checklist_lives" ADD CONSTRAINT "fk_user_progress_checklist_lives_checklist_id_checklists" FOREIGN KEY ("checklist_id") REFERENCES "checklists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_progress_checklist_lives" ADD CONSTRAINT "fk_user_progress_checklist_lives_domain_id_domains" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_progress_checklists" ADD CONSTRAINT "fk_user_progress_checklists_checklist_id_checklists" FOREIGN KEY ("checklist_id") REFERENCES "checklists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_progress_checklists" ADD CONSTRAINT "fk_user_progress_checklists_domain_id_domains" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_progress_demo_lives" ADD CONSTRAINT "fk_user_progress_demo_lives_demo_id_demo_lives" FOREIGN KEY ("demo_id") REFERENCES "demo_lives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_progress_demo_lives" ADD CONSTRAINT "fk_user_progress_demo_lives_domain_id_domains" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_progress_demos" ADD CONSTRAINT "fk_user_progress_demos_demo_id_demo_lives" FOREIGN KEY ("demo_id") REFERENCES "demo_lives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_progress_demos" ADD CONSTRAINT "fk_user_progress_demos_domain_id_domains" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_progress_helper_lives" ADD CONSTRAINT "fk_user_progress_helper_lives_domain_id_domains" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_progress_helper_lives" ADD CONSTRAINT "fk_user_progress_helper_lives_helper_id_helpers" FOREIGN KEY ("helper_id") REFERENCES "helpers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_progress_helpers" ADD CONSTRAINT "fk_user_progress_helpers_domain_id_domains" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_progress_helpers" ADD CONSTRAINT "fk_user_progress_helpers_helper_id_helpers" FOREIGN KEY ("helper_id") REFERENCES "helpers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_progress_product_tour_lives" ADD CONSTRAINT "fk_user_progress_product_tour_lives_domain_id_domains" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_progress_product_tour_lives" ADD CONSTRAINT "fk_user_progress_product_tour_lives_product_tour_id_product_tou" FOREIGN KEY ("product_tour_id") REFERENCES "product_tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_progress_product_tours" ADD CONSTRAINT "fk_user_progress_product_tour_domain_id_domains" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_progress_product_tours" ADD CONSTRAINT "fk_user_progress_product_tour_id_product_tours" FOREIGN KEY ("product_tour_id") REFERENCES "product_tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_role_associations" ADD CONSTRAINT "fk_user_role_associations_role_id_roles" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_role_associations" ADD CONSTRAINT "fk_user_role_associations_user_id_users" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_session_activities" ADD CONSTRAINT "fk_user_session_activities_browser_id_browsers" FOREIGN KEY ("browser_id") REFERENCES "browsers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_session_activities" ADD CONSTRAINT "fk_user_session_activities_browser_language_id_browser_language" FOREIGN KEY ("browser_language_id") REFERENCES "browser_languages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_session_activities" ADD CONSTRAINT "fk_user_session_activities_country_id_countries" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_session_activities" ADD CONSTRAINT "fk_user_session_activities_currency_id_currencies" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_session_activities" ADD CONSTRAINT "fk_user_session_activities_domain_id_domains" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_session_activities" ADD CONSTRAINT "fk_user_session_activities_entrance_page_id_pages" FOREIGN KEY ("entrance_page_id") REFERENCES "pages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_session_activities" ADD CONSTRAINT "fk_user_session_activities_exit_page_id_pages" FOREIGN KEY ("exit_page_id") REFERENCES "pages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_session_activities" ADD CONSTRAINT "fk_user_session_activities_operating_system_id_operating_system" FOREIGN KEY ("operating_system_id") REFERENCES "operating_systems"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_session_activities" ADD CONSTRAINT "fk_user_session_activities_state_id_states" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_session_activities" ADD CONSTRAINT "fk_user_session_activities_timezone_id_timezones" FOREIGN KEY ("timezone_id") REFERENCES "timezones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_session_activities" ADD CONSTRAINT "fk_user_session_activities_user_id_user_tracked_datas" FOREIGN KEY ("domain_id", "user_created_at_fk", "user_id") REFERENCES "tracked_users"("domain_id", "created_at", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fk_users_default_role_id_roles" FOREIGN KEY ("default_role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tracked_users" ADD CONSTRAINT "fk_user_tracked_datas_browser_id_browsers" FOREIGN KEY ("browser_id") REFERENCES "browsers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tracked_users" ADD CONSTRAINT "fk_user_tracked_datas_country_id_countries" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tracked_users" ADD CONSTRAINT "fk_user_tracked_datas_currency_id_currencies" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tracked_users" ADD CONSTRAINT "fk_user_tracked_datas_domain_id_domains" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tracked_users" ADD CONSTRAINT "fk_user_tracked_datas_operating_system_id_operating_systems" FOREIGN KEY ("operating_system_id") REFERENCES "operating_systems"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tracked_users" ADD CONSTRAINT "fk_user_tracked_datas_timezone_id_timezones" FOREIGN KEY ("timezone_id") REFERENCES "timezones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "segment_users" ADD CONSTRAINT "fkey_segment_users_segment_id_segments" FOREIGN KEY ("segment_id") REFERENCES "segments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "segment_users" ADD CONSTRAINT "fkey_segment_users_user_id_user_tracked_datas" FOREIGN KEY ("domain_id", "user_created_at_fk", "user_id") REFERENCES "tracked_users"("domain_id", "created_at", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_response_answers" ADD CONSTRAINT "fk_survey_question_id" FOREIGN KEY ("survey_question_id") REFERENCES "survey_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_response_answers" ADD CONSTRAINT "fk_survey_response_id" FOREIGN KEY ("survey_response_id") REFERENCES "survey_responses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_responses" ADD CONSTRAINT "fk_survey_responses_domain_id" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_responses" ADD CONSTRAINT "fk_survey_responses_session_id" FOREIGN KEY ("domain_id", "session_started_at_fk", "session_id") REFERENCES "user_session_activities"("domain_id", "started_at", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_responses" ADD CONSTRAINT "fk_survey_responses_survey_id" FOREIGN KEY ("survey_id") REFERENCES "surveys"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_responses" ADD CONSTRAINT "fk_survey_responses_user_id" FOREIGN KEY ("domain_id", "user_created_at_fk", "user_id") REFERENCES "tracked_users"("domain_id", "created_at", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;
