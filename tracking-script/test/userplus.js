(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["UserPlus"] = factory();
	else
		root["UserPlus"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/config.ts":
/*!***********************!*\
  !*** ./src/config.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const config = {
    API_SERVICES: {
        TRACKING: "https://userplus.io/api/new-tracking",
        IP_TRACKING: "https://pro.ip-api.com/json/?fields=66842623&key=82LH3HgJ6w0DP7N"
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (config);


/***/ }),

/***/ "./src/constants.ts":
/*!**************************!*\
  !*** ./src/constants.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (constants);


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   generateUID: () => (/* binding */ generateUID),
/* harmony export */   getCookie: () => (/* binding */ getCookie),
/* harmony export */   setCookie: () => (/* binding */ setCookie)
/* harmony export */ });
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}
function generateUID() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./src/userplus.ts ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ "./src/config.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./src/constants.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



class UserPlus {
    constructor(script_id) {
        this.IDLE_TIMEOUT = 60 * 1000;
        this.api_url = _config__WEBPACK_IMPORTED_MODULE_0__["default"].API_SERVICES.TRACKING;
        this.session_id = sessionStorage.getItem('userplus_session_id');
        this.account_tracking_id = localStorage.getItem('userplus_user_id');
        this.user_type = Number(localStorage.getItem('userplus_user_type') || _constants__WEBPACK_IMPORTED_MODULE_2__["default"].userType.anonymous);
        this.script_id = script_id;
        this.domain_id = null;
        this.session_state = Number(localStorage.getItem('userplus_session_state') || _constants__WEBPACK_IMPORTED_MODULE_2__["default"].sessionState.inactive);
        this.user_details = localStorage.getItem('userplus_user_details') ? JSON.parse(localStorage.getItem('userplus_user_details') || '') : null;
        this.verifyScript().then(response => {
            if (response.isVerified) {
                this.domain_id = response.payload.domain_id;
                this.initTracking().then(() => {
                    console.log("Userplus initialized");
                });
            }
        });
    }
    initTracking() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.session_id) {
                if (!this.account_tracking_id)
                    this.account_tracking_id = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.generateUID)();
                this.session_id = yield this.createSession(this.account_tracking_id);
                this.session_state = _constants__WEBPACK_IMPORTED_MODULE_2__["default"].sessionState.active;
                if (this.session_id !== null) {
                    localStorage.setItem('userplus_session_state', this.session_state.toString());
                    localStorage.setItem('userplus_user_id', this.account_tracking_id);
                    localStorage.setItem('userplus_user_type', String(this.user_type));
                    sessionStorage.setItem('userplus_session_id', this.session_id);
                }
            }
            if (this.session_id) {
                this.trackPageView();
                this.trackClicks();
                this.handleUnload();
                this.trackSPAChanges();
                this.trackIdleState();
            }
        });
    }
    getAttributes(payload) {
        return Object.fromEntries(Object.entries(payload).map(([key, value]) => [key, Array.isArray(value) ? "array" : typeof value]));
    }
    getPageInfo() {
        const urlParams = new URLSearchParams(window.location.search);
        const utmData = {};
        ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(param => {
            if (urlParams.has(param)) {
                utmData[param] = urlParams.get(param) || "";
            }
        });
        return {
            page_url: window.location.href,
            page_title: document.title,
            referrer_url: document.referrer,
            domain: new URL(window.location.href).origin,
            browser_language: navigator.language,
            char_set: document.characterSet,
            device_type: this.getDeviceType(),
            utmData: utmData,
        };
    }
    createSession(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const getLocationData = yield this.getGeoLocationFromIP();
            if (getLocationData.status !== 'success') {
                return null;
            }
            delete getLocationData.status;
            const session_info = {
                browser_language: navigator.language,
                char_set: document.characterSet,
                device_type: this.getDeviceType(),
                domain: new URL(window.location.href).origin,
                page_title: document.title,
                page_url: window.location.href,
                referrer_url: document.referrer,
            };
            const payload = {
                session_info: session_info,
                user_info: {
                    tracking_id: user_id,
                    user_type: Number(this.user_type),
                    user_details: Object.assign(Object.assign({}, this.user_details), { user_id: user_id })
                },
                geo_location: getLocationData,
                script_id: this.script_id,
                fired_at: new Date().toISOString(),
                domain_id: this.domain_id,
                channel: _constants__WEBPACK_IMPORTED_MODULE_2__["default"].channelStatus.web
            };
            const session_data = yield this.request(_constants__WEBPACK_IMPORTED_MODULE_2__["default"].endpoints.createSession, "POST", payload);
            sessionStorage.setItem('userplus_session_id', session_data.data.session_id);
            this.session_id = session_data.data.session_id;
            return session_data.data.session_id;
        });
    }
    getGeoLocationFromIP() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(_config__WEBPACK_IMPORTED_MODULE_0__["default"].API_SERVICES.IP_TRACKING);
                const result = yield response.json();
                return Object.assign({}, result);
            }
            catch (error) {
                console.log(error);
                return { status: false };
            }
        });
    }
    trackPageView() {
        const tracking_data = Object.assign({}, this.getPageInfo());
        const attributes = this.getAttributes(tracking_data);
        const payload = {
            data: tracking_data,
            attributes: attributes,
            event: _constants__WEBPACK_IMPORTED_MODULE_2__["default"].events.pageView,
            process: _constants__WEBPACK_IMPORTED_MODULE_2__["default"].events.pageView,
            script_id: this.script_id,
            session_id: this.session_id,
            user_info: {
                tracking_id: this.account_tracking_id,
                user_type: Number(this.user_type),
                user_details: Object.assign(Object.assign({}, this.user_details), { user_id: this.account_tracking_id })
            },
            domain_id: this.domain_id,
            fired_at: new Date().toISOString(),
        };
        this.request(_constants__WEBPACK_IMPORTED_MODULE_2__["default"].endpoints.track, "POST", payload);
    }
    manageSession(session_state) {
        localStorage.setItem('userplus_session_state', session_state.toString());
        this.session_state = session_state;
        const payload = {
            minsToWait: _constants__WEBPACK_IMPORTED_MODULE_2__["default"].session.minsToWait,
            session_id: this.session_id,
            session_state: session_state,
            script_id: this.script_id,
            fired_at: new Date().toISOString(),
            process: _constants__WEBPACK_IMPORTED_MODULE_2__["default"].events.manageSession,
        };
        this.request(_constants__WEBPACK_IMPORTED_MODULE_2__["default"].endpoints.track, "POST", payload);
    }
    event(event, event_payload) {
        const payload = {
            data: event_payload,
            attributes: this.getAttributes(event_payload),
            event: event,
            process: _constants__WEBPACK_IMPORTED_MODULE_2__["default"].events.pageView,
            script_id: this.script_id,
            session_id: this.session_id,
            user_info: {
                tracking_id: this.account_tracking_id,
                user_type: Number(this.user_type),
                user_details: Object.assign(Object.assign({}, this.user_details), { user_id: this.account_tracking_id })
            },
            domain_id: this.domain_id,
            fired_at: new Date().toISOString(),
        };
        this.request(_constants__WEBPACK_IMPORTED_MODULE_2__["default"].endpoints.track, "POST", payload);
    }
    trackClicks() {
        document.addEventListener('click', (event) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (this.session_state === _constants__WEBPACK_IMPORTED_MODULE_2__["default"].sessionState.idle) {
                this.manageSession(_constants__WEBPACK_IMPORTED_MODULE_2__["default"].sessionState.active);
            }
            const target = event.target;
            if (['BUTTON', 'A'].includes(target.tagName)) {
                const eventPayload = {
                    element: target.tagName,
                    text: ((_a = target === null || target === void 0 ? void 0 : target.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || "",
                    href: target.getAttribute('href') || "",
                    target: target.getAttribute('target') || "",
                    rel: target.getAttribute('rel') || "",
                    class: target.getAttribute('class') || "",
                    id: target.getAttribute('id') || "",
                    attributes: this.getAttributes(target),
                };
                this.event(_constants__WEBPACK_IMPORTED_MODULE_2__["default"].events.click, eventPayload);
            }
        }), true);
    }
    identify(user_id, user_payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const anonymous_user_id = this.account_tracking_id;
            if (user_id !== this.account_tracking_id && this.user_type === _constants__WEBPACK_IMPORTED_MODULE_2__["default"].userType.identified) {
                this.account_tracking_id = user_id;
                this.session_id = yield this.createSession(user_id);
            }
            this.account_tracking_id = user_id;
            const isPreviousUserAnonymous = this.user_type === _constants__WEBPACK_IMPORTED_MODULE_2__["default"].userType.anonymous;
            this.user_type = _constants__WEBPACK_IMPORTED_MODULE_2__["default"].userType.identified;
            this.user_details = user_payload;
            localStorage.setItem('userplus_user_id', this.account_tracking_id);
            localStorage.setItem('userplus_user_type', String(_constants__WEBPACK_IMPORTED_MODULE_2__["default"].userType.identified));
            localStorage.setItem('userplus_user_data', JSON.stringify(user_payload));
            const payload = Object.assign({ user_info: { tracking_id: user_id, user_type: _constants__WEBPACK_IMPORTED_MODULE_2__["default"].userType.identified, user_details: user_payload }, attributes: this.getAttributes(user_payload), fired_at: new Date().toISOString(), script_id: this.script_id, session_id: this.session_id, domain_id: this.domain_id, minsToWait: _constants__WEBPACK_IMPORTED_MODULE_2__["default"].session.minsToWait }, (isPreviousUserAnonymous && { anonymous_tracking_id: anonymous_user_id }));
            this.request(_constants__WEBPACK_IMPORTED_MODULE_2__["default"].endpoints.identify, "POST", payload);
        });
    }
    handleUnload() {
        window.addEventListener('beforeunload', () => {
            this.deactiveSession();
        });
    }
    deactiveSession() {
        const data = {
            page_url: window.location.href,
            page_title: document.title,
            referrer_url: document.referrer,
            domain: new URL(window.location.href).origin,
            browser_language: navigator.language,
            char_set: document.characterSet,
            device_type: this.getDeviceType(),
        };
        const attributes = this.getAttributes(data);
        const payload = {
            script_id: this.script_id,
            session_id: this.session_id,
            page_url: window.location.href,
            process: _constants__WEBPACK_IMPORTED_MODULE_2__["default"].events.deactivate,
            fired_at: new Date().toISOString(),
            domain_id: this.domain_id,
            data: data,
            attributes: attributes,
        };
        localStorage.removeItem('userplus_user_id');
        localStorage.removeItem('userplus_user_type');
        localStorage.removeItem('userplus_user_data');
        localStorage.removeItem('userplus_session_state');
        localStorage.removeItem('userplus_session_id');
        this.session_state = _constants__WEBPACK_IMPORTED_MODULE_2__["default"].sessionState.inactive;
        this.session_id = null;
        this.account_tracking_id = null;
        this.user_type = _constants__WEBPACK_IMPORTED_MODULE_2__["default"].userType.anonymous;
        this.user_details = null;
        this.domain_id = null;
        this.request(_constants__WEBPACK_IMPORTED_MODULE_2__["default"].endpoints.track, "POST", payload);
    }
    trackIdleState() {
        let idleTimer;
        const resetTimer = () => {
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                if (this.session_state === _constants__WEBPACK_IMPORTED_MODULE_2__["default"].sessionState.active)
                    this.manageSession(_constants__WEBPACK_IMPORTED_MODULE_2__["default"].sessionState.idle);
                if (this.session_state === _constants__WEBPACK_IMPORTED_MODULE_2__["default"].sessionState.inactive)
                    this.manageSession(_constants__WEBPACK_IMPORTED_MODULE_2__["default"].sessionState.active);
            }, this.IDLE_TIMEOUT);
        };
        ["mousemove", "keydown", "scroll", "click"].forEach(event => {
            window.addEventListener(event, resetTimer);
        });
        resetTimer();
    }
    trackSPAChanges() {
        const observer = new MutationObserver(() => {
            if (window.location.href !== sessionStorage.getItem("last_url")) {
                sessionStorage.setItem("last_url", window.location.href);
                this.trackPageView();
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    }
    getDeviceType() {
        if (window.screen.width < 768) {
            return 'Mobile';
        }
        else if (window.screen.width >= 768 && window.screen.width < 1024) {
            return 'Tablet';
        }
        else if (window.screen.width >= 1024) {
            return 'Desktop';
        }
    }
    verifyScript() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.request(_constants__WEBPACK_IMPORTED_MODULE_2__["default"].endpoints.verify, "POST", {
                script_id: this.script_id,
                current_domain: "coral-ana-73.tiiny.site"
            });
            return { isVerified: response.status, payload: response.data };
        });
    }
    request(endpoint_1) {
        return __awaiter(this, arguments, void 0, function* (endpoint, method = 'GET', body) {
            const response = yield fetch(this.api_url + endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            return yield response.json();
        });
    }
}
window.userplus = {
    init: (script_id) => {
        window.userplus = new UserPlus(script_id);
    }
};

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Yix5QkFBeUIsa0RBQVM7QUFDbEMsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLGtEQUFTO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLGtEQUFTO0FBQ3RDO0FBQ0E7QUFDQSx5QkFBeUIsa0RBQVM7QUFDbEM7QUFDQTtBQUNBLHFCQUFxQixrREFBUztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsa0RBQVM7QUFDcEQsdUNBQXVDLGtEQUFTO0FBQ2hELDJDQUEyQyxrREFBUztBQUNwRCx1Q0FBdUMsa0RBQVM7QUFDaEQsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULHFDQUFxQyxnQ0FBZ0M7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxrREFBUztBQUN6RDtBQUNBO0FBQ0EsYUFBYTtBQUNiLHFCQUFxQjtBQUNyQixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSxhQUFhO0FBQ2I7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Vc2VyUGx1cy93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vVXNlclBsdXMvLi9zcmMvY29uZmlnLnRzIiwid2VicGFjazovL1VzZXJQbHVzLy4vc3JjL2NvbnN0YW50cy50cyIsIndlYnBhY2s6Ly9Vc2VyUGx1cy8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly9Vc2VyUGx1cy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9Vc2VyUGx1cy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vVXNlclBsdXMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9Vc2VyUGx1cy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL1VzZXJQbHVzLy4vc3JjL3VzZXJwbHVzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlVzZXJQbHVzXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIlVzZXJQbHVzXCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgKCkgPT4ge1xucmV0dXJuICIsImNvbnN0IGNvbmZpZyA9IHtcbiAgICBBUElfU0VSVklDRVM6IHtcbiAgICAgICAgVFJBQ0tJTkc6IFwiaHR0cHM6Ly91c2VycGx1cy5pby9hcGkvbmV3LXRyYWNraW5nXCIsXG4gICAgICAgIElQX1RSQUNLSU5HOiBcImh0dHBzOi8vcHJvLmlwLWFwaS5jb20vanNvbi8/ZmllbGRzPTY2ODQyNjIzJmtleT04MkxIM0hnSjZ3MERQN05cIlxuICAgIH1cbn07XG5leHBvcnQgZGVmYXVsdCBjb25maWc7XG4iLCJjb25zdCBjb25zdGFudHMgPSB7XG4gICAgXCJlbmRwb2ludHNcIjoge1xuICAgICAgICBcInZlcmlmeVwiOiAnL3ZlcmlmeScsXG4gICAgICAgIFwidHJhY2tcIjogXCIvdFwiLFxuICAgICAgICBcImlkZW50aWZ5XCI6IFwiL2lkZW50aWZ5XCIsXG4gICAgICAgIFwiY3JlYXRlU2Vzc2lvblwiOiBcIi9jc1wiXG4gICAgfSxcbiAgICBcInVzZXJUeXBlXCI6IHtcbiAgICAgICAgXCJpZGVudGlmaWVkXCI6IDEsXG4gICAgICAgIFwiYW5vbnltb3VzXCI6IDIsXG4gICAgfSxcbiAgICBcInNlc3Npb25TdGF0ZVwiOiB7XG4gICAgICAgIFwiYWN0aXZlXCI6IDEsXG4gICAgICAgIFwiaWRsZVwiOiAyLFxuICAgICAgICBcImluYWN0aXZlXCI6IDMsXG4gICAgfSxcbiAgICBcImNoYW5uZWxTdGF0dXNcIjoge1xuICAgICAgICBcIndlYlwiOiAxLFxuICAgICAgICBcInNoYXJlYWJsZV9saW5rXCI6IDIsXG4gICAgICAgIFwiZGVtb1wiOiAzXG4gICAgfSxcbiAgICBcImNhdGVnb3JpZXNcIjoge1xuICAgICAgICBcImN1c3RvbVwiOiBcImN1c3RvbVwiLFxuICAgICAgICBcImJyb3dzZXJBdHRyaWJ1dGVzXCI6IFwiYnJvd3Nlcl9hdHRyaWJ1dGVzXCJcbiAgICB9LFxuICAgIFwiZXZlbnRzXCI6IHtcbiAgICAgICAgXCJwYWdlVmlld1wiOiBcInBhZ2Vfdmlld1wiLFxuICAgICAgICBcImNsaWNrXCI6IFwiY2xpY2tcIixcbiAgICAgICAgXCJpZGVudGlmeVwiOiBcImlkZW50aWZ5XCIsXG4gICAgICAgIFwibWFuYWdlU2Vzc2lvblwiOiBcIm1hbmFnZV9zZXNzaW9uXCIsXG4gICAgICAgIFwiZGVhY3RpdmF0ZVwiOiBcImRlYWN0aXZhdGVcIlxuICAgIH0sXG4gICAgXCJzZXNzaW9uXCI6IHtcbiAgICAgICAgXCJtaW5zVG9XYWl0XCI6IDEsXG4gICAgICAgIFwiYWN0aXZlU2Vzc2lvblwiOiBcImFjdGl2ZVwiLFxuICAgICAgICBcImlkbGVTZXNzaW9uXCI6IFwiaWRsZVwiLFxuICAgICAgICBcInNvY2tldFN0YXJ0ZWRcIjogZmFsc2UsXG4gICAgICAgIFwic29ja2V0SWRcIjogXCJcIlxuICAgIH0sXG4gICAgXCJjb25kaXRpb25cIjoge1xuICAgICAgICBcInVzZXJcIjoge1xuICAgICAgICAgICAgXCJzdGFydHNXaXRoXCI6IFwic3RhcnRzIHdpdGhcIixcbiAgICAgICAgICAgIFwiZG9lc05vdFN0YXJ0V2l0aFwiOiBcImRvZXNuJ3Qgc3RhcnQgd2l0aFwiLFxuICAgICAgICAgICAgXCJlbmRzV2l0aFwiOiBcImVuZHMgd2l0aFwiLFxuICAgICAgICAgICAgXCJkb2VzTm90RW5kV2l0aFwiOiBcImRvZXNuJ3QgZW5kIHdpdGhcIixcbiAgICAgICAgICAgIFwiY29udGFpbnNcIjogXCJjb250YWluc1wiLFxuICAgICAgICAgICAgXCJkb2VzTm90Q29udGFpblwiOiBcImRvZXNuJ3QgY29udGFpblwiLFxuICAgICAgICAgICAgXCJlcXVhbHNcIjogXCJlcXVhbHNcIixcbiAgICAgICAgICAgIFwiZG9lc05vdEVxdWFsXCI6IFwiZG9lc24ndCBlcXVhbFwiLFxuICAgICAgICAgICAgXCJtYXRjaGVzXCI6IFwibWF0Y2hlc1wiLFxuICAgICAgICAgICAgXCJkb2VzTm90TWF0Y2hcIjogXCJkb2Vzbid0IG1hdGNoXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJzZXNzaW9uQXR0cmlidXRlc1wiOiB7XG4gICAgICAgICAgICBcImlzT25lT2ZcIjogXCJpcyBvbmUgb2ZcIixcbiAgICAgICAgICAgIFwiaXNOb3RPbmVPZlwiOiBcImlzIG5vdCBvbmUgb2ZcIlxuICAgICAgICB9LFxuICAgICAgICBcImxvZ2ljYWxPclwiOiBcImFueVwiLFxuICAgICAgICBcImxvZ2ljYWxBbmRcIjogXCJhbGxcIlxuICAgIH1cbn07XG5leHBvcnQgZGVmYXVsdCBjb25zdGFudHM7XG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0Q29va2llKG5hbWUpIHtcbiAgICBsZXQgbmFtZUVRID0gbmFtZSArIFwiPVwiO1xuICAgIGxldCBjYSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2EubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGMgPSBjYVtpXTtcbiAgICAgICAgd2hpbGUgKGMuY2hhckF0KDApID09PSAnICcpXG4gICAgICAgICAgICBjID0gYy5zdWJzdHJpbmcoMSwgYy5sZW5ndGgpO1xuICAgICAgICBpZiAoYy5pbmRleE9mKG5hbWVFUSkgPT09IDApXG4gICAgICAgICAgICByZXR1cm4gYy5zdWJzdHJpbmcobmFtZUVRLmxlbmd0aCwgYy5sZW5ndGgpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzZXRDb29raWUobmFtZSwgdmFsdWUsIGRheXMpIHtcbiAgICBsZXQgZXhwaXJlcyA9IFwiXCI7XG4gICAgaWYgKGRheXMpIHtcbiAgICAgICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyAoZGF5cyAqIDI0ICogNjAgKiA2MCAqIDEwMDApKTtcbiAgICAgICAgZXhwaXJlcyA9IFwiOyBleHBpcmVzPVwiICsgZGF0ZS50b1VUQ1N0cmluZygpO1xuICAgIH1cbiAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyB2YWx1ZSArIGV4cGlyZXMgKyBcIjsgcGF0aD0vXCI7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVVSUQoKSB7XG4gICAgcmV0dXJuIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygyLCAxNSkgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgMTUpO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmltcG9ydCBjb25maWcgZnJvbSBcIi4vY29uZmlnXCI7XG5pbXBvcnQgeyBnZW5lcmF0ZVVJRCB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgY29uc3RhbnRzIGZyb20gXCIuL2NvbnN0YW50c1wiO1xuY2xhc3MgVXNlclBsdXMge1xuICAgIGNvbnN0cnVjdG9yKHNjcmlwdF9pZCkge1xuICAgICAgICB0aGlzLklETEVfVElNRU9VVCA9IDYwICogMTAwMDtcbiAgICAgICAgdGhpcy5hcGlfdXJsID0gY29uZmlnLkFQSV9TRVJWSUNFUy5UUkFDS0lORztcbiAgICAgICAgdGhpcy5zZXNzaW9uX2lkID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgndXNlcnBsdXNfc2Vzc2lvbl9pZCcpO1xuICAgICAgICB0aGlzLmFjY291bnRfdHJhY2tpbmdfaWQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcnBsdXNfdXNlcl9pZCcpO1xuICAgICAgICB0aGlzLnVzZXJfdHlwZSA9IE51bWJlcihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcnBsdXNfdXNlcl90eXBlJykgfHwgY29uc3RhbnRzLnVzZXJUeXBlLmFub255bW91cyk7XG4gICAgICAgIHRoaXMuc2NyaXB0X2lkID0gc2NyaXB0X2lkO1xuICAgICAgICB0aGlzLmRvbWFpbl9pZCA9IG51bGw7XG4gICAgICAgIHRoaXMuc2Vzc2lvbl9zdGF0ZSA9IE51bWJlcihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcnBsdXNfc2Vzc2lvbl9zdGF0ZScpIHx8IGNvbnN0YW50cy5zZXNzaW9uU3RhdGUuaW5hY3RpdmUpO1xuICAgICAgICB0aGlzLnVzZXJfZGV0YWlscyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VycGx1c191c2VyX2RldGFpbHMnKSA/IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXJwbHVzX3VzZXJfZGV0YWlscycpIHx8ICcnKSA6IG51bGw7XG4gICAgICAgIHRoaXMudmVyaWZ5U2NyaXB0KCkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2UuaXNWZXJpZmllZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZG9tYWluX2lkID0gcmVzcG9uc2UucGF5bG9hZC5kb21haW5faWQ7XG4gICAgICAgICAgICAgICAgdGhpcy5pbml0VHJhY2tpbmcoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVc2VycGx1cyBpbml0aWFsaXplZFwiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGluaXRUcmFja2luZygpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5zZXNzaW9uX2lkKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmFjY291bnRfdHJhY2tpbmdfaWQpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWNjb3VudF90cmFja2luZ19pZCA9IGdlbmVyYXRlVUlEKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXNzaW9uX2lkID0geWllbGQgdGhpcy5jcmVhdGVTZXNzaW9uKHRoaXMuYWNjb3VudF90cmFja2luZ19pZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXNzaW9uX3N0YXRlID0gY29uc3RhbnRzLnNlc3Npb25TdGF0ZS5hY3RpdmU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2Vzc2lvbl9pZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlcnBsdXNfc2Vzc2lvbl9zdGF0ZScsIHRoaXMuc2Vzc2lvbl9zdGF0ZS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJwbHVzX3VzZXJfaWQnLCB0aGlzLmFjY291bnRfdHJhY2tpbmdfaWQpO1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlcnBsdXNfdXNlcl90eXBlJywgU3RyaW5nKHRoaXMudXNlcl90eXBlKSk7XG4gICAgICAgICAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ3VzZXJwbHVzX3Nlc3Npb25faWQnLCB0aGlzLnNlc3Npb25faWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnNlc3Npb25faWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyYWNrUGFnZVZpZXcoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRyYWNrQ2xpY2tzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVVbmxvYWQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRyYWNrU1BBQ2hhbmdlcygpO1xuICAgICAgICAgICAgICAgIHRoaXMudHJhY2tJZGxlU3RhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGdldEF0dHJpYnV0ZXMocGF5bG9hZCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmZyb21FbnRyaWVzKE9iamVjdC5lbnRyaWVzKHBheWxvYWQpLm1hcCgoW2tleSwgdmFsdWVdKSA9PiBba2V5LCBBcnJheS5pc0FycmF5KHZhbHVlKSA/IFwiYXJyYXlcIiA6IHR5cGVvZiB2YWx1ZV0pKTtcbiAgICB9XG4gICAgZ2V0UGFnZUluZm8oKSB7XG4gICAgICAgIGNvbnN0IHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG4gICAgICAgIGNvbnN0IHV0bURhdGEgPSB7fTtcbiAgICAgICAgW1widXRtX3NvdXJjZVwiLCBcInV0bV9tZWRpdW1cIiwgXCJ1dG1fY2FtcGFpZ25cIiwgXCJ1dG1fY29udGVudFwiLCBcInV0bV90ZXJtXCJdLmZvckVhY2gocGFyYW0gPT4ge1xuICAgICAgICAgICAgaWYgKHVybFBhcmFtcy5oYXMocGFyYW0pKSB7XG4gICAgICAgICAgICAgICAgdXRtRGF0YVtwYXJhbV0gPSB1cmxQYXJhbXMuZ2V0KHBhcmFtKSB8fCBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHBhZ2VfdXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICAgICAgICAgIHBhZ2VfdGl0bGU6IGRvY3VtZW50LnRpdGxlLFxuICAgICAgICAgICAgcmVmZXJyZXJfdXJsOiBkb2N1bWVudC5yZWZlcnJlcixcbiAgICAgICAgICAgIGRvbWFpbjogbmV3IFVSTCh3aW5kb3cubG9jYXRpb24uaHJlZikub3JpZ2luLFxuICAgICAgICAgICAgYnJvd3Nlcl9sYW5ndWFnZTogbmF2aWdhdG9yLmxhbmd1YWdlLFxuICAgICAgICAgICAgY2hhcl9zZXQ6IGRvY3VtZW50LmNoYXJhY3RlclNldCxcbiAgICAgICAgICAgIGRldmljZV90eXBlOiB0aGlzLmdldERldmljZVR5cGUoKSxcbiAgICAgICAgICAgIHV0bURhdGE6IHV0bURhdGEsXG4gICAgICAgIH07XG4gICAgfVxuICAgIGNyZWF0ZVNlc3Npb24odXNlcl9pZCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgZ2V0TG9jYXRpb25EYXRhID0geWllbGQgdGhpcy5nZXRHZW9Mb2NhdGlvbkZyb21JUCgpO1xuICAgICAgICAgICAgaWYgKGdldExvY2F0aW9uRGF0YS5zdGF0dXMgIT09ICdzdWNjZXNzJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVsZXRlIGdldExvY2F0aW9uRGF0YS5zdGF0dXM7XG4gICAgICAgICAgICBjb25zdCBzZXNzaW9uX2luZm8gPSB7XG4gICAgICAgICAgICAgICAgYnJvd3Nlcl9sYW5ndWFnZTogbmF2aWdhdG9yLmxhbmd1YWdlLFxuICAgICAgICAgICAgICAgIGNoYXJfc2V0OiBkb2N1bWVudC5jaGFyYWN0ZXJTZXQsXG4gICAgICAgICAgICAgICAgZGV2aWNlX3R5cGU6IHRoaXMuZ2V0RGV2aWNlVHlwZSgpLFxuICAgICAgICAgICAgICAgIGRvbWFpbjogbmV3IFVSTCh3aW5kb3cubG9jYXRpb24uaHJlZikub3JpZ2luLFxuICAgICAgICAgICAgICAgIHBhZ2VfdGl0bGU6IGRvY3VtZW50LnRpdGxlLFxuICAgICAgICAgICAgICAgIHBhZ2VfdXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICAgICAgICAgICAgICByZWZlcnJlcl91cmw6IGRvY3VtZW50LnJlZmVycmVyLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgICAgICAgICAgc2Vzc2lvbl9pbmZvOiBzZXNzaW9uX2luZm8sXG4gICAgICAgICAgICAgICAgdXNlcl9pbmZvOiB7XG4gICAgICAgICAgICAgICAgICAgIHRyYWNraW5nX2lkOiB1c2VyX2lkLFxuICAgICAgICAgICAgICAgICAgICB1c2VyX3R5cGU6IE51bWJlcih0aGlzLnVzZXJfdHlwZSksXG4gICAgICAgICAgICAgICAgICAgIHVzZXJfZGV0YWlsczogT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCB0aGlzLnVzZXJfZGV0YWlscyksIHsgdXNlcl9pZDogdXNlcl9pZCB9KVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2VvX2xvY2F0aW9uOiBnZXRMb2NhdGlvbkRhdGEsXG4gICAgICAgICAgICAgICAgc2NyaXB0X2lkOiB0aGlzLnNjcmlwdF9pZCxcbiAgICAgICAgICAgICAgICBmaXJlZF9hdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgICAgICAgIGRvbWFpbl9pZDogdGhpcy5kb21haW5faWQsXG4gICAgICAgICAgICAgICAgY2hhbm5lbDogY29uc3RhbnRzLmNoYW5uZWxTdGF0dXMud2ViXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3Qgc2Vzc2lvbl9kYXRhID0geWllbGQgdGhpcy5yZXF1ZXN0KGNvbnN0YW50cy5lbmRwb2ludHMuY3JlYXRlU2Vzc2lvbiwgXCJQT1NUXCIsIHBheWxvYWQpO1xuICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgndXNlcnBsdXNfc2Vzc2lvbl9pZCcsIHNlc3Npb25fZGF0YS5kYXRhLnNlc3Npb25faWQpO1xuICAgICAgICAgICAgdGhpcy5zZXNzaW9uX2lkID0gc2Vzc2lvbl9kYXRhLmRhdGEuc2Vzc2lvbl9pZDtcbiAgICAgICAgICAgIHJldHVybiBzZXNzaW9uX2RhdGEuZGF0YS5zZXNzaW9uX2lkO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0R2VvTG9jYXRpb25Gcm9tSVAoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0geWllbGQgZmV0Y2goY29uZmlnLkFQSV9TRVJWSUNFUy5JUF9UUkFDS0lORyk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0geWllbGQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCByZXN1bHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7IHN0YXR1czogZmFsc2UgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHRyYWNrUGFnZVZpZXcoKSB7XG4gICAgICAgIGNvbnN0IHRyYWNraW5nX2RhdGEgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdldFBhZ2VJbmZvKCkpO1xuICAgICAgICBjb25zdCBhdHRyaWJ1dGVzID0gdGhpcy5nZXRBdHRyaWJ1dGVzKHRyYWNraW5nX2RhdGEpO1xuICAgICAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgICAgICAgZGF0YTogdHJhY2tpbmdfZGF0YSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IGF0dHJpYnV0ZXMsXG4gICAgICAgICAgICBldmVudDogY29uc3RhbnRzLmV2ZW50cy5wYWdlVmlldyxcbiAgICAgICAgICAgIHByb2Nlc3M6IGNvbnN0YW50cy5ldmVudHMucGFnZVZpZXcsXG4gICAgICAgICAgICBzY3JpcHRfaWQ6IHRoaXMuc2NyaXB0X2lkLFxuICAgICAgICAgICAgc2Vzc2lvbl9pZDogdGhpcy5zZXNzaW9uX2lkLFxuICAgICAgICAgICAgdXNlcl9pbmZvOiB7XG4gICAgICAgICAgICAgICAgdHJhY2tpbmdfaWQ6IHRoaXMuYWNjb3VudF90cmFja2luZ19pZCxcbiAgICAgICAgICAgICAgICB1c2VyX3R5cGU6IE51bWJlcih0aGlzLnVzZXJfdHlwZSksXG4gICAgICAgICAgICAgICAgdXNlcl9kZXRhaWxzOiBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHRoaXMudXNlcl9kZXRhaWxzKSwgeyB1c2VyX2lkOiB0aGlzLmFjY291bnRfdHJhY2tpbmdfaWQgfSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkb21haW5faWQ6IHRoaXMuZG9tYWluX2lkLFxuICAgICAgICAgICAgZmlyZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5yZXF1ZXN0KGNvbnN0YW50cy5lbmRwb2ludHMudHJhY2ssIFwiUE9TVFwiLCBwYXlsb2FkKTtcbiAgICB9XG4gICAgbWFuYWdlU2Vzc2lvbihzZXNzaW9uX3N0YXRlKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VycGx1c19zZXNzaW9uX3N0YXRlJywgc2Vzc2lvbl9zdGF0ZS50b1N0cmluZygpKTtcbiAgICAgICAgdGhpcy5zZXNzaW9uX3N0YXRlID0gc2Vzc2lvbl9zdGF0ZTtcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgICAgICAgIG1pbnNUb1dhaXQ6IGNvbnN0YW50cy5zZXNzaW9uLm1pbnNUb1dhaXQsXG4gICAgICAgICAgICBzZXNzaW9uX2lkOiB0aGlzLnNlc3Npb25faWQsXG4gICAgICAgICAgICBzZXNzaW9uX3N0YXRlOiBzZXNzaW9uX3N0YXRlLFxuICAgICAgICAgICAgc2NyaXB0X2lkOiB0aGlzLnNjcmlwdF9pZCxcbiAgICAgICAgICAgIGZpcmVkX2F0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgICBwcm9jZXNzOiBjb25zdGFudHMuZXZlbnRzLm1hbmFnZVNlc3Npb24sXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucmVxdWVzdChjb25zdGFudHMuZW5kcG9pbnRzLnRyYWNrLCBcIlBPU1RcIiwgcGF5bG9hZCk7XG4gICAgfVxuICAgIGV2ZW50KGV2ZW50LCBldmVudF9wYXlsb2FkKSB7XG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgICAgICBkYXRhOiBldmVudF9wYXlsb2FkLFxuICAgICAgICAgICAgYXR0cmlidXRlczogdGhpcy5nZXRBdHRyaWJ1dGVzKGV2ZW50X3BheWxvYWQpLFxuICAgICAgICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgcHJvY2VzczogY29uc3RhbnRzLmV2ZW50cy5wYWdlVmlldyxcbiAgICAgICAgICAgIHNjcmlwdF9pZDogdGhpcy5zY3JpcHRfaWQsXG4gICAgICAgICAgICBzZXNzaW9uX2lkOiB0aGlzLnNlc3Npb25faWQsXG4gICAgICAgICAgICB1c2VyX2luZm86IHtcbiAgICAgICAgICAgICAgICB0cmFja2luZ19pZDogdGhpcy5hY2NvdW50X3RyYWNraW5nX2lkLFxuICAgICAgICAgICAgICAgIHVzZXJfdHlwZTogTnVtYmVyKHRoaXMudXNlcl90eXBlKSxcbiAgICAgICAgICAgICAgICB1c2VyX2RldGFpbHM6IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgdGhpcy51c2VyX2RldGFpbHMpLCB7IHVzZXJfaWQ6IHRoaXMuYWNjb3VudF90cmFja2luZ19pZCB9KVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRvbWFpbl9pZDogdGhpcy5kb21haW5faWQsXG4gICAgICAgICAgICBmaXJlZF9hdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnJlcXVlc3QoY29uc3RhbnRzLmVuZHBvaW50cy50cmFjaywgXCJQT1NUXCIsIHBheWxvYWQpO1xuICAgIH1cbiAgICB0cmFja0NsaWNrcygpIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlc3Npb25fc3RhdGUgPT09IGNvbnN0YW50cy5zZXNzaW9uU3RhdGUuaWRsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMubWFuYWdlU2Vzc2lvbihjb25zdGFudHMuc2Vzc2lvblN0YXRlLmFjdGl2ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICAgICAgICBpZiAoWydCVVRUT04nLCAnQSddLmluY2x1ZGVzKHRhcmdldC50YWdOYW1lKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50UGF5bG9hZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogdGFyZ2V0LnRhZ05hbWUsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICgoX2EgPSB0YXJnZXQgPT09IG51bGwgfHwgdGFyZ2V0ID09PSB2b2lkIDAgPyB2b2lkIDAgOiB0YXJnZXQudGV4dENvbnRlbnQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS50cmltKCkpIHx8IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIGhyZWY6IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSB8fCBcIlwiLFxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ3RhcmdldCcpIHx8IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIHJlbDogdGFyZ2V0LmdldEF0dHJpYnV0ZSgncmVsJykgfHwgXCJcIixcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgfHwgXCJcIixcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2lkJykgfHwgXCJcIixcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlczogdGhpcy5nZXRBdHRyaWJ1dGVzKHRhcmdldCksXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50KGNvbnN0YW50cy5ldmVudHMuY2xpY2ssIGV2ZW50UGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLCB0cnVlKTtcbiAgICB9XG4gICAgaWRlbnRpZnkodXNlcl9pZCwgdXNlcl9wYXlsb2FkKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBhbm9ueW1vdXNfdXNlcl9pZCA9IHRoaXMuYWNjb3VudF90cmFja2luZ19pZDtcbiAgICAgICAgICAgIGlmICh1c2VyX2lkICE9PSB0aGlzLmFjY291bnRfdHJhY2tpbmdfaWQgJiYgdGhpcy51c2VyX3R5cGUgPT09IGNvbnN0YW50cy51c2VyVHlwZS5pZGVudGlmaWVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hY2NvdW50X3RyYWNraW5nX2lkID0gdXNlcl9pZDtcbiAgICAgICAgICAgICAgICB0aGlzLnNlc3Npb25faWQgPSB5aWVsZCB0aGlzLmNyZWF0ZVNlc3Npb24odXNlcl9pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFjY291bnRfdHJhY2tpbmdfaWQgPSB1c2VyX2lkO1xuICAgICAgICAgICAgY29uc3QgaXNQcmV2aW91c1VzZXJBbm9ueW1vdXMgPSB0aGlzLnVzZXJfdHlwZSA9PT0gY29uc3RhbnRzLnVzZXJUeXBlLmFub255bW91cztcbiAgICAgICAgICAgIHRoaXMudXNlcl90eXBlID0gY29uc3RhbnRzLnVzZXJUeXBlLmlkZW50aWZpZWQ7XG4gICAgICAgICAgICB0aGlzLnVzZXJfZGV0YWlscyA9IHVzZXJfcGF5bG9hZDtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VycGx1c191c2VyX2lkJywgdGhpcy5hY2NvdW50X3RyYWNraW5nX2lkKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VycGx1c191c2VyX3R5cGUnLCBTdHJpbmcoY29uc3RhbnRzLnVzZXJUeXBlLmlkZW50aWZpZWQpKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VycGx1c191c2VyX2RhdGEnLCBKU09OLnN0cmluZ2lmeSh1c2VyX3BheWxvYWQpKTtcbiAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSBPYmplY3QuYXNzaWduKHsgdXNlcl9pbmZvOiB7IHRyYWNraW5nX2lkOiB1c2VyX2lkLCB1c2VyX3R5cGU6IGNvbnN0YW50cy51c2VyVHlwZS5pZGVudGlmaWVkLCB1c2VyX2RldGFpbHM6IHVzZXJfcGF5bG9hZCB9LCBhdHRyaWJ1dGVzOiB0aGlzLmdldEF0dHJpYnV0ZXModXNlcl9wYXlsb2FkKSwgZmlyZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgc2NyaXB0X2lkOiB0aGlzLnNjcmlwdF9pZCwgc2Vzc2lvbl9pZDogdGhpcy5zZXNzaW9uX2lkLCBkb21haW5faWQ6IHRoaXMuZG9tYWluX2lkLCBtaW5zVG9XYWl0OiBjb25zdGFudHMuc2Vzc2lvbi5taW5zVG9XYWl0IH0sIChpc1ByZXZpb3VzVXNlckFub255bW91cyAmJiB7IGFub255bW91c190cmFja2luZ19pZDogYW5vbnltb3VzX3VzZXJfaWQgfSkpO1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0KGNvbnN0YW50cy5lbmRwb2ludHMuaWRlbnRpZnksIFwiUE9TVFwiLCBwYXlsb2FkKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGhhbmRsZVVubG9hZCgpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGVhY3RpdmVTZXNzaW9uKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBkZWFjdGl2ZVNlc3Npb24oKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICBwYWdlX3VybDogd2luZG93LmxvY2F0aW9uLmhyZWYsXG4gICAgICAgICAgICBwYWdlX3RpdGxlOiBkb2N1bWVudC50aXRsZSxcbiAgICAgICAgICAgIHJlZmVycmVyX3VybDogZG9jdW1lbnQucmVmZXJyZXIsXG4gICAgICAgICAgICBkb21haW46IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpLm9yaWdpbixcbiAgICAgICAgICAgIGJyb3dzZXJfbGFuZ3VhZ2U6IG5hdmlnYXRvci5sYW5ndWFnZSxcbiAgICAgICAgICAgIGNoYXJfc2V0OiBkb2N1bWVudC5jaGFyYWN0ZXJTZXQsXG4gICAgICAgICAgICBkZXZpY2VfdHlwZTogdGhpcy5nZXREZXZpY2VUeXBlKCksXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSB0aGlzLmdldEF0dHJpYnV0ZXMoZGF0YSk7XG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgICAgICBzY3JpcHRfaWQ6IHRoaXMuc2NyaXB0X2lkLFxuICAgICAgICAgICAgc2Vzc2lvbl9pZDogdGhpcy5zZXNzaW9uX2lkLFxuICAgICAgICAgICAgcGFnZV91cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICAgICAgcHJvY2VzczogY29uc3RhbnRzLmV2ZW50cy5kZWFjdGl2YXRlLFxuICAgICAgICAgICAgZmlyZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICAgIGRvbWFpbl9pZDogdGhpcy5kb21haW5faWQsXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgYXR0cmlidXRlczogYXR0cmlidXRlcyxcbiAgICAgICAgfTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3VzZXJwbHVzX3VzZXJfaWQnKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3VzZXJwbHVzX3VzZXJfdHlwZScpO1xuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndXNlcnBsdXNfdXNlcl9kYXRhJyk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd1c2VycGx1c19zZXNzaW9uX3N0YXRlJyk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd1c2VycGx1c19zZXNzaW9uX2lkJyk7XG4gICAgICAgIHRoaXMuc2Vzc2lvbl9zdGF0ZSA9IGNvbnN0YW50cy5zZXNzaW9uU3RhdGUuaW5hY3RpdmU7XG4gICAgICAgIHRoaXMuc2Vzc2lvbl9pZCA9IG51bGw7XG4gICAgICAgIHRoaXMuYWNjb3VudF90cmFja2luZ19pZCA9IG51bGw7XG4gICAgICAgIHRoaXMudXNlcl90eXBlID0gY29uc3RhbnRzLnVzZXJUeXBlLmFub255bW91cztcbiAgICAgICAgdGhpcy51c2VyX2RldGFpbHMgPSBudWxsO1xuICAgICAgICB0aGlzLmRvbWFpbl9pZCA9IG51bGw7XG4gICAgICAgIHRoaXMucmVxdWVzdChjb25zdGFudHMuZW5kcG9pbnRzLnRyYWNrLCBcIlBPU1RcIiwgcGF5bG9hZCk7XG4gICAgfVxuICAgIHRyYWNrSWRsZVN0YXRlKCkge1xuICAgICAgICBsZXQgaWRsZVRpbWVyO1xuICAgICAgICBjb25zdCByZXNldFRpbWVyID0gKCkgPT4ge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGlkbGVUaW1lcik7XG4gICAgICAgICAgICBpZGxlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZXNzaW9uX3N0YXRlID09PSBjb25zdGFudHMuc2Vzc2lvblN0YXRlLmFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYW5hZ2VTZXNzaW9uKGNvbnN0YW50cy5zZXNzaW9uU3RhdGUuaWRsZSk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2Vzc2lvbl9zdGF0ZSA9PT0gY29uc3RhbnRzLnNlc3Npb25TdGF0ZS5pbmFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYW5hZ2VTZXNzaW9uKGNvbnN0YW50cy5zZXNzaW9uU3RhdGUuYWN0aXZlKTtcbiAgICAgICAgICAgIH0sIHRoaXMuSURMRV9USU1FT1VUKTtcbiAgICAgICAgfTtcbiAgICAgICAgW1wibW91c2Vtb3ZlXCIsIFwia2V5ZG93blwiLCBcInNjcm9sbFwiLCBcImNsaWNrXCJdLmZvckVhY2goZXZlbnQgPT4ge1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIHJlc2V0VGltZXIpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVzZXRUaW1lcigpO1xuICAgIH1cbiAgICB0cmFja1NQQUNoYW5nZXMoKSB7XG4gICAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5ocmVmICE9PSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwibGFzdF91cmxcIikpIHtcbiAgICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFwibGFzdF91cmxcIiwgd2luZG93LmxvY2F0aW9uLmhyZWYpO1xuICAgICAgICAgICAgICAgIHRoaXMudHJhY2tQYWdlVmlldygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudCwgeyBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfSk7XG4gICAgfVxuICAgIGdldERldmljZVR5cGUoKSB7XG4gICAgICAgIGlmICh3aW5kb3cuc2NyZWVuLndpZHRoIDwgNzY4KSB7XG4gICAgICAgICAgICByZXR1cm4gJ01vYmlsZSc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAod2luZG93LnNjcmVlbi53aWR0aCA+PSA3NjggJiYgd2luZG93LnNjcmVlbi53aWR0aCA8IDEwMjQpIHtcbiAgICAgICAgICAgIHJldHVybiAnVGFibGV0JztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh3aW5kb3cuc2NyZWVuLndpZHRoID49IDEwMjQpIHtcbiAgICAgICAgICAgIHJldHVybiAnRGVza3RvcCc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmVyaWZ5U2NyaXB0KCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB5aWVsZCB0aGlzLnJlcXVlc3QoY29uc3RhbnRzLmVuZHBvaW50cy52ZXJpZnksIFwiUE9TVFwiLCB7XG4gICAgICAgICAgICAgICAgc2NyaXB0X2lkOiB0aGlzLnNjcmlwdF9pZCxcbiAgICAgICAgICAgICAgICBjdXJyZW50X2RvbWFpbjogXCJjb3JhbC1hbmEtNzMudGlpbnkuc2l0ZVwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB7IGlzVmVyaWZpZWQ6IHJlc3BvbnNlLnN0YXR1cywgcGF5bG9hZDogcmVzcG9uc2UuZGF0YSB9O1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVxdWVzdChlbmRwb2ludF8xKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgYXJndW1lbnRzLCB2b2lkIDAsIGZ1bmN0aW9uKiAoZW5kcG9pbnQsIG1ldGhvZCA9ICdHRVQnLCBib2R5KSB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IHlpZWxkIGZldGNoKHRoaXMuYXBpX3VybCArIGVuZHBvaW50LCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShib2R5KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4geWllbGQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG53aW5kb3cudXNlcnBsdXMgPSB7XG4gICAgaW5pdDogKHNjcmlwdF9pZCkgPT4ge1xuICAgICAgICB3aW5kb3cudXNlcnBsdXMgPSBuZXcgVXNlclBsdXMoc2NyaXB0X2lkKTtcbiAgICB9XG59O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9