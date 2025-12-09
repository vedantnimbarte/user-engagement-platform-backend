export const REDIS_CHANNELS = {
  UP_TRACKING_QUEUE: "up_tracking_queue"
};

export const EMAIL_TEMPLATES = {
  EMAIL_VERIFICATION: "email_verification",
  OTP_LOGIN: "otp_login",
  INVITATION_LINK: "invitation_link",
  TWO_FACTOR_AUTHENTICATION_LOGIN: "two_factor_authentication_login",
  SET_PASSWORD_LINK: "set_password_link",
  WELCOME_ON_REGISTRATION: "welcome_on_registration",
  ASSIGN_USER_TO_ORG: "assign_user_to_org",
  CHANGE_EMAIL: "change_email",
  CHANGE_PASSWORD: "change_password",
  TEST_MAIL: "test_mail",
  UNLINK_TWO_FACTOR_AUTHENTICATION: "unlink_two_factor_authentication",
  DETAILS_OF_DEMO_REQUEST: "details_of_demo_request",
  NEW_USER_REGISTER: "new_user_register",
  SEND_INSTRUCTION: "send_instruction",
  FREE_TRIAL_ACTIVE: "free_trial_active",
  RESPONSE_OF_DEMO_REQUEST: "response_of_demo_request",
  //NewTemplates
  PRE_REGISTRATION_VERIFICATION: "pre_registration_verification",
  RESET_PASSWORD_LINK: "reset_password_link",
  PASSWORD_CHANGED: "password_changed",
  LINK_TWO_FACTOR_AUTHENTICATION: "link_two_factor_authentication",
  INVITE_USER: "invite_user",
};

export const channelStatus = {
  WEB: 1,
  SHAREABLE_LINK: 2,
  DEMO: 3,
};

export const userActivityState = {
  ACTIVE:1,
  IDLE:2,
  INACTIVE:3
}

export const trackedUserType = {
  IDENTIFIED: 1,
  ANONYMOUS: 2
}

export const upConstants = {
  FEATURE_TYPE: {
    CHECKLIST: "checklist",
    PRODUCT_TOUR: "product_tour",
    SURVEY: "survey",
    HELPER: "helper",
  },
  ipStack: {
    accessKey: "d9711815ca3d9972bb0fda2a9811ed91",
  },
  userloveFeatures: ["checklist", "product_tour", "survey", "helper"],
  featureProgressEvents: [
    "up_checklist_item_completed",
    "up_checklist_dismissed",
    "up_checklist_completed",
    "up_checklist_triggered",
    "up_checklist_item_completed_bulk",
    "up_product_tour_launched",
    "up_product_tour_skipped",
    "up_product_tour_step_seen",
    "up_product_tour_step_issue",
    "up_survey_triggered",
    "up_survey_question_completed",
    "up_survey_completed",
    "up_survey_question_dismissed",
    "up_survey_dismissed",
    "up_product_tour_completed",
    "up_demo_triggered",
    "up_demo_played",
    "up_demo_viewport_entered",
    "up_demo_viewport_exited",
    "up_demo_step_seen",
    "up_demo_replayed",
    "up_demo_cta_clicked",
    "up_demo_hotspot_clicked",
    "up_demo_branding_clicked",
    "up_demo_completed",
    "up_demo_full_screen_entered",
    "up_demo_full_screen_exited",
    "up_helper_triggered",
    "up_helper_launched",
    "up_helper_item_clicked",
    "up_helper_searched",
    "up_helper_closed",
  ],
  featureProgressEventsName: {
    checklist: {
      checklistCompleted: "up_checklist_completed",
      checklistDismissed: "up_checklist_dismissed",
      checklistItemCompleted: "up_checklist_item_completed",
      checklistTriggered: "up_checklist_triggered",
    },
    productTour: {
      productTourLaunched: "up_product_tour_launched",
      productTourStepSeen: "up_product_tour_step_seen",
      productTourCompleted: "up_product_tour_completed",
      productTourSkipped: "up_product_tour_skipped",
      productTourStepIssue: "up_product_tour_step_issue",
    },
    survey: {
      surveyTriggered: "up_survey_triggered",
      surveyQuestionCompleted: "up_survey_question_completed",
      surveyCompleted: "up_survey_completed",
      surveyDismissed: "up_survey_dismissed",
    },
    demo: {
      demoTriggered: "up_demo_triggered",
      demoPlayed: "up_demo_played",
      demoViewportEntered: "up_demo_viewport_entered",
      demoViewportExited: "up_demo_viewport_exited",
      demoStepSeen: "up_demo_step_seen",
      demoReplayed: "up_demo_replayed",
      demoCtaClicked: "up_demo_cta_clicked",
      demoHotspotClicked: "up_demo_hotspot_clicked",
      demoBrandingClicked: "up_demo_branding_clicked",
      demoCompleted: "up_demo_completed",
      demoFullScreenEntered: "up_demo_full_screen_entered",
      demoFullScreenExited: "up_demo_full_screen_exited",
    },
    helper: {
      helperTriggered: "up_helper_triggered",
      helperLaunched: "up_helper_launched",
      helperItemClicked: "up_helper_item_clicked",
      helperSearched: "up_helper_searched",
      helperClosed: "up_helper_closed",
      helperError: "up_helper_error",
      helperItemError: "up_helper_item_error",
    },
  },
  systemEvents: ["page_view", "click", "active_session", "idle_session"],
};