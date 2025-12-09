const constants = {
  "endpoints": {
    "verify": '/verify',
    "track": "/t",
    "identify": "/identify",
    "createSession": "/cs"
  },
  "userType": {
    "identified": 1,
    "anonymous": 2,
  },
  "sessionState": {
    "active": 1,
    "idle": 2,
    "inactive": 3,
  },
  "channelStatus": {
    "web": 1,
    "shareable_link": 2,
    "demo": 3
  },
  "categories": {
    "custom": "custom",
    "browserAttributes": "browser_attributes"
  },
  "events": {
    "pageView": "page_view",
    "click": "click",
    "identify": "identify",
    "manageSession": "manage_session",
    "deactivate": "deactivate"
  },
  "session": {
    "minsToWait": 1,
    "activeSession": "active",
    "idleSession": "idle",
    "socketStarted": false,
    "socketId": ""
  },
  "condition": {
    "user": {
      "startsWith": "starts with",
      "doesNotStartWith": "doesn't start with",
      "endsWith": "ends with",
      "doesNotEndWith": "doesn't end with",
      "contains": "contains",
      "doesNotContain": "doesn't contain",
      "equals": "equals",
      "doesNotEqual": "doesn't equal",
      "matches": "matches",
      "doesNotMatch": "doesn't match"
    },
    "sessionAttributes": {
      "isOneOf": "is one of",
      "isNotOneOf": "is not one of"
    },
    "logicalOr": "any",
    "logicalAnd": "all"
  }
}

export default constants;