const questionsResponseFormat = {
  nps: {
    question: "here you can write question",
    question_description: "here you can write description of question",
    logic: {
      Distractor: "Distractor means user have given answere below 6 out of 10, here in this field you can provide 3 possible values('id of next question means user will be jump to that id question' , 'next_questions' , 'finish_survey' )",
      Passive: "Passive means user have given answere between 6 to 8 out of 10, here in this field you can provide 3 possible values('id of next question means user will be jump to that id question' , 'next_questions' , 'finish_survey' )",
      Promoter: "Promoter means user have given answere above 8 out of 10, here in this field you can provide 3 possible values('id of next question means user will be jump to that id question' , 'next_questions' , 'finish_survey' )"
    },
    design: {
      color_type: "here two type of value can come 'Gradient' or 'solid', gradiant means 3 colors according number of question, like 1to6 red,7to8 yellow,9to10 green and solid means single color",
      first_color: "here you can provide color in hex code",
      second_color: "here you can provide color in hex code",
      third_color: "here you can provide color in hex code"
    },
    range: "here you can provide range answer number like 3 or 5 or 10",
    reverseValue: "here you can provide boolean value true or false, it will reverse the answer like start with 10 and end with 1",
    start1: "here you can provide boolean value true or false, it will start with 1 instead of 0"
  },
  long_answer: {
    question: "here you can write question",
    description: "here you can write description of question",
    placeHolderText: "here you can provide placeholder text",
    buttonText: "here you can provide button text like 'Submit Feedback'",
    logic: {
      anyOptions: "here you can provide 3 possible values('id of next question means user will be jump to that id question' , 'next_questions' , 'finish_survey' )"
    },
    requireAnswer: "here you can provide boolean value true or false, it will make question mandatory",
    backButton: "here you can provide boolean value true or false, it will add back button in question",
    backButtonText: "here you can provide back button text like 'Back'",
    backButtonPosition: "here you can provide back button position like 'Right' or 'Left' or 'Center'"
  },
  yes_no_question: {
    question: "here you can write question",
    description: "here you can write description of question",
    yesButton: "here you can provide yes button text like 'Yes'",
    noButton: "here you can provide no button text like 'No'",
    logic: {
      yesOptions: "here you can provide 3 possible values('id of next question means user will be jump to that id question' , 'next_questions' , 'finish_survey' )",
      noOptions: "here you can provide 3 possible values('id of next question means user will be jump to that id question' , 'next_questions' , 'finish_survey' )"
    },
    highLightYesButton: "here you can provide boolean value true or false, it will highlight yes button",
    reverseButton: "here you can provide boolean value true or false, it will reverse the button position"
  },
  contact_information: {
    question: "here you can write question",
    description: "here you can write description of question",
    fields: {
      "first_name" : {
        "label" : "here you can provide field label like 'First name'",
        "show" : "here you can provide boolean value true or false, it will show field in question",
        "required" : "here you can provide boolean value true or false, it will make field mandatory"
      },
      "last_name" : {
        "label" : "here you can provide field label like 'Last name'",
        "show" : "here you can provide boolean value true or false, it will show field in question",
        "required" : "here you can provide boolean value true or false, it will make field mandatory"
      },
      "phone_no" : {
        "label" : "here you can provide field label like 'Phone number'",
        "show" : "here you can provide boolean value true or false, it will show field in question",
        "required" : "here you can provide boolean value true or false, it will make field mandatory"
      },
      "email" : {
        "label" : "here you can provide field label like 'Email'",
        "show" : "here you can provide boolean value true or false, it will show field in question",
        "required" : "here you can provide boolean value true or false, it will make field mandatory"
      },
      "company" : {
        "label" : "here you can provide field label like 'Company'",
        "show" : "here you can provide boolean value true or false, it will show field in question",
        "required" : "here you can provide boolean value true or false, it will make field mandatory"
      }
    },
    logic: {
      anyAnser: "here you can provide 3 possible values('id of next question means user will be jump to that id question' , 'next_questions' , 'finish_survey' )"
    },
    requireAnswer: "here you can provide boolean value true or false, it will make question mandatory",
    backButton: "here you can provide boolean value true or false, it will add back button in question",
    backButtonText: "here you can provide back button text like 'Back'",
    backButtonPosition: "here you can provide back button position like 'Right' or 'Left' or 'Center'"
  },
  multiple_choice: {
    question: "here you can write question",
    description: "here you can write description of question",
    options: [
      {
        optionDesc: "here you can provide option description like 'Option 1'",
        comment: "here you can provide boolean value true or false, it will add comment field in option",
        commentRequired: "here you can provide boolean value true or false, it will make comment mandatory",
        checked: "here you can provide boolean value true or false, it will make option checked by default"
      }
    ],
    logic: {
      anyOptions: "here you can provide 3 possible values('id of next question means user will be jump to that id question' , 'next_questions' , 'finish_survey' )"
    },
    minSelect: "here you can provide minimum number of options to select like 0",
    maxSelect: "here you can provide maximum number of options to select like 2",
    nextButton: "here you can provide boolean value true or false, it will add next button in question",
    backButton: "here you can provide boolean value true or false, it will add back button in question",
    nextButtonText: "here you can provide next button text like 'Next'",
    backButtonText: "here you can provide back button text like 'Back'",
    buttonPosition: "here you can provide button position like 'Right' or 'Left' or 'Center'"
  },
  single_answer_list: {
    question: "here you can write question",
    description: "here you can write description of question",
    options: [
      {
        optionDesc: "here you can provide option description like 'Option 1'",
        comment: "here you can provide boolean value true or false, it will add comment field in option",
        commentRequired: "here you can provide boolean value true or false, it will make comment mandatory",
        checked: "here you can provide boolean value true or false, it will make option checked by default"
      }
    ],
    nextButton: "here you can provide boolean value true or false, it will add next button in question",
    backButton: "here you can provide boolean value true or false, it will add back button in question",
    nextButtonText: "here you can provide next button text like 'Next'",
    backButtonText: "here you can provide back button text like 'Back'",
    buttonPosition: "here you can provide button position like 'Right' or 'Left' or 'Center'"
  },
  introduction_panel: {
    question: "here you can write your headline and introduction sentences",
    description: "here you can write description",
    buttonText: "here you can provide button text like 'Continue'",
    logic: {
      anyOptions: "here you can provide 3 possible values('id of next question means user will be jump to that id question' , 'next_questions' , 'finish_survey' )"
    },
    backButton: "here you can provide boolean value true or false, it will add back button in question",
    backButtonTxt: "here you can provide back button text like 'Back'",
    backButtonPosition: "here you can provide back button position like 'Right' or 'Left' or 'Center'"
  },
  csat: {
    question: "here you can write question",
    description: "here you can write description of question",
    lowRating: "here you can provide low rating text like 'Unsatisfied'",
    highRating: "here you can provide high rating text like 'Satisfied'",
    logic: {
      Distractor: "here you can provide 3 possible values('id of next question means user will be jump to that id question' , 'next_questions' , 'finish_survey' )",
      Passive: "here you can provide 3 possible values('id of next question means user will be jump to that id question' , 'next_questions' , 'finish_survey' )",
      Promoter: "here you can provide 3 possible values('id of next question means user will be jump to that id question' , 'next_questions' , 'finish_survey' )"
    },
    range: "here you can provide range answer number like 3 or 5 or 10",
    reverseValue: "here you can provide boolean value true or false, it will reverse the answer like start with 10 and end with 1",
    start1: "here you can provide boolean value true or false, it will start with 1 instead of 0"
  },
  ces: {
    question: "here you can write question",
    description: "here you can write description of question",
    lowRating: "here you can provide low rating text like 'Unsatisfied'",
    highRating: "here you can provide high rating text like 'Satisfied'",
    logic: {
      Distractor: "here you can provide 3 possible values('id of next question means user will be jump to that id question' , 'next_questions' , 'finish_survey' )",
      Passive: "here you can provide 3 possible values('id of next question means user will be jump to that id question' , 'next_questions' , 'finish_survey' )",
      Promoter: "here you can provide 3 possible values('id of next question means user will be jump to that id question' , 'next_questions' , 'finish_survey' )"
    },
    range: "here you can provide range answer number like 3 or 5 or 10",
    shape: "here you can provide shape like 'Numeric' or 'Star' or 'thumb'"
  },
  call_to_action: {
    question: "here you can write question",
    description: "here you can write description of question",
    targetUrl: "here you can provide target url like 'https://google.com'",
    buttonText: "here you can provide button text like 'Click here'",
    logic: {
      anyOptions: "here you can provide 3 possible values('id of next question means user will be jump to that id question' , 'next_questions' , 'finish_survey' )"
    },
    openNewTab: "here you can provide boolean value true or false, it will open url in new tab",
    backButton: "here you can provide boolean value true or false, it will add back button in question",
    backButtonText: "here you can provide back button text like 'Back'",
    backButtonPosition: "here you can provide back button position like 'Right' or 'Left' or 'Center'"
  },
  star_rating: {
    question: "here you can write question",
    description: "here you can write description of question",
    lowRating: "here you can provide low rating text like 'Unsatisfied'",
    highRating: "here you can provide high rating text like 'Satisfied'",
    logic: {
      Distractor: "here you can provide 3 possible values('id of next question means user will be jump to that id question' , 'next_questions' , 'finish_survey' )",
      Passive: "here you can provide 3 possible values('id of next question means user will be jump to that id question' , 'next_questions' , 'finish_survey' )",
      Promoter: "here you can provide 3 possible values('id of next question means user will be jump to that id question' , 'next_questions' , 'finish_survey' )"
    },
    range: "here you can provide range answer number like 3 or 5 or 10"
  },
  rating_matrix: {
    question: "here you can write question",
    description: "here you can write description of question",
    scalePoint: "here you can provide scale point like 5",
    scaleLable: "here you can provide scale label like ['Very bad', 'Bad', 'Neutral', 'Good', 'Very good']",
    statement: [
      {
        statement_id: "here you can provide statement id like 1",
        statement_text: "here you can provide statement text like 'Statement 1'"
      },
      {
        statement_id: "here you can provide statement id like 2",
        statement_text: "here you can provide statement text like 'Statement 2'"
      }
    ]
  },
  short_answer: {
    question: "here you can write question",
    description: "here you can write description of question",
    placeHolderText: "here you can provide placeholder text like 'Write your answer here'",
    buttonText: "here you can provide button text like 'Submit Feedback'",
    logic: {
      anyOptions: "here you can provide 3 possible values('id of next question means user will be jump to that id question' , 'next_questions' , 'finish_survey' )"
    },
    requireAnswer: "here you can provide boolean value true or false, it will make question mandatory",
    backButton: "here you can provide boolean value true or false, it will add back button in question",
    backButtonText: "here you can provide back button text like 'Back'",
    backButtonPosition: "here you can provide back button position like 'Right' or 'Left' or 'Center'"
  },
  email: {
    question: "here you can write question",
    description: "here you can write description of question",
    placeHolderText: "here you can provide placeholder text like 'Write your email here'",
    buttonText: "here you can provide button text like 'Submit'",
    logic: {
      anyOptions: "here you can provide 3 possible values('id of next question means user will be jump to that id question' , 'next_questions' , 'finish_survey' )"
    },
    requireAnswer: "here you can provide boolean value true or false, it will make question mandatory",
    backButton: "here you can provide boolean value true or false, it will add back button in question",
    backButtonText: "here you can provide back button text like 'Back'",
    backButtonPosition: "here you can provide back button position like 'Right' or 'Left' or 'Center'"
  },
  end_of_survey: {
    question: "here you can write thank you message",
    description: "here you can write description for thank you message",
    delightAnimation: "here you can provide boolean value true or false, it will add delight animation in question",
    autoCloseSecond: "here you can provide auto close second like 4"
  }
}

//survey question types

const surveyQuestionTypes = {
  nps : "this is used to masure net promoter score",
  csat : "this is used to masure customer satisfaction",
  ces : "this is used to masure customer effort score",
  call_to_action : "this is used to add call to action",
  star_rating : "this is used to add star rating",
  rating_matrix : "this is used to add rating matrix",
  short_answer : "this is used to add short answer",
  long_answer : "this is used to add long answer",
  yes_no_question : "this is used to add yes no question",
  contact_information : "this is used to add contact information",
  end_of_survey : "this is used to add end of survey",
  introduction_panel : "this is used to add introduction panel",
  single_answer_list : "this is used to add single answer list",
  dropdown : "this is used to add dropdown list",
  multiple_answer_list : "this is used to add multiple answer list"
}

// You are a survey creation assistant. Your job is to generate detailed JSON-formatted survey structures based on the goal provided by the user.

// The surveys are meant to be used within an app. You must follow strict formatting for each type of question and apply logic jumps between questions based on user answers. The tone of all questions should be **casual and friendly** with **emoji support**. Every field should be filled with default or relevant values — no fields should be left empty.

// ---

// ## 📦 QUESTION TYPES AND THEIR PURPOSES

// - nps : used to measure Net Promoter Score
// - csat : used to measure Customer Satisfaction
// - ces : used to measure Customer Effort Score
// - call_to_action : used to add a call-to-action with a button
// - star_rating : used to show a 5-star or 10-star rating
// - rating_matrix : used to rate multiple statements in matrix layout
// - short_answer : used to get a short text response
// - long_answer : used to get detailed feedback from users
// - yes_no_question : used for simple binary choice
// - contact_information : used to collect name, phone, email, etc.
// - end_of_survey : used to thank the user and optionally close the survey
// - introduction_panel : used to welcome or introduce the survey
// - single_answer_list : used to select one answer from a list
// - dropdown : used for dropdown-style selection
// - multiple_answer_list : used to select multiple answers

// ---

// ## 🧠 DEFAULT RULES TO FOLLOW

// 1. You must decide **which questions to ask**, **how many**, and **in which order** based on the goal.
// 2. Always apply **logic jumps** if applicable — e.g., from NPS to different follow-up questions depending on score.
// 3. Default scale for NPS, CSAT, and CES is **10** unless specified.
// 4. Default color type is **"solid"**.
// 5. Always add:
//    - `placeholderText`
//    - `buttonText`
//    - `backButton`, `backButtonText`, `backButtonPosition` (where applicable)
// 6. The tone must be **casual, friendly**, and use **emojis** where it makes sense.
// 7. No fields should be left blank. Use dummy/default values if necessary.

// ---

// ## 🎯 LOGIC STRUCTURE FORMAT (EXAMPLE)

// For logic routing in questions like NPS/CSAT/CES:
// ```json
// "logic": {
//   "Distractor": "q2",
//   "Passive": "q3",
//   "Promoter": "q4"
// }
