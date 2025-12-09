import config from "./config";
import { generateUID } from "./utils";
import constants from "./constants";

class UserPlus {
    private readonly api_url: string | undefined;
    private session_id: string | null;
    private account_tracking_id: string | null;
    private user_details: Record<string, any> | null;
    private user_type: number;
    private readonly script_id: string;
    private domain_id: number | null;
    private session_state: number;
    private readonly IDLE_TIMEOUT = 60 * 1000; // 1 MINUTE IDLE TIME

    constructor(script_id: string) {
        this.api_url = config.API_SERVICES.TRACKING;
        this.session_id =  sessionStorage.getItem('userplus_session_id');
        this.account_tracking_id =  localStorage.getItem('userplus_user_id');
        this.user_type = Number(localStorage.getItem('userplus_user_type') || constants.userType.anonymous);
        this.script_id = script_id;
        this.domain_id = null;
        this.session_state = Number(localStorage.getItem('userplus_session_state') || constants.sessionState.inactive);
        this.user_details = localStorage.getItem('userplus_user_details') ? JSON.parse(localStorage.getItem('userplus_user_details') || '') : null;


        this.verifyScript().then(response => {
            if(response.isVerified) {
                this.domain_id = response.payload.domain_id;
                this.initTracking().then(() => {
                    console.log("Userplus initialized");
                });
            }
        })
    }
    
    private async initTracking(): Promise<void> {
        if(!this.session_id) {
            if(!this.account_tracking_id) this.account_tracking_id = generateUID();
            this.session_id = await this.createSession(this.account_tracking_id);
            this.session_state = constants.sessionState.active;
            if(this.session_id !== null) {
                localStorage.setItem('userplus_session_state', this.session_state.toString());
                localStorage.setItem('userplus_user_id', this.account_tracking_id);
                localStorage.setItem('userplus_user_type', String(this.user_type));
                sessionStorage.setItem('userplus_session_id', this.session_id);
            }
        }

        if(this.session_id) {
            this.trackPageView();
            this.trackClicks();
            this.handleUnload();
            this.trackSPAChanges();
            this.trackIdleState();
        }
    }

    private getAttributes(payload: any): Record<string, any> {
        return Object.fromEntries(
            Object.entries(payload).map(([key, value]) => [key, Array.isArray(value) ? "array" : typeof value])
          );
          
    }

    private getPageInfo(): Record<string, any> {
        const urlParams = new URLSearchParams(window.location.search);
        const utmData: Record<string, string> = {};
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
        }
    }

    private async createSession(user_id: string): Promise<string | null> {
        const getLocationData = await this.getGeoLocationFromIP();
        if(getLocationData.status !== 'success') {
            return null
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
        }

        const payload = {
            session_info: session_info,
            user_info: {
                tracking_id: user_id,
                user_type: Number(this.user_type),
                user_details: {...this.user_details, user_id: user_id,}
            },
            geo_location: getLocationData,
            script_id: this.script_id,
            fired_at: new Date().toISOString(),
            domain_id: this.domain_id,
            channel: constants.channelStatus.web
        };
        const session_data = await this.request(constants.endpoints.createSession, "POST", payload);
        sessionStorage.setItem('userplus_session_id', session_data.data.session_id);
        this.session_id = session_data.data.session_id;
        return session_data.data.session_id;
    }

    private async getGeoLocationFromIP(): Promise<Record<string, any>> {
        try {
            // @ts-ignore
            const response = await fetch(config.API_SERVICES.IP_TRACKING);
            const result = await response.json();
            return {...result}
        } catch (error) {
            console.log(error);
            return {status: false};
        }
    }

    private trackPageView(): void {
        const tracking_data = {
            ...this.getPageInfo()
        };
        const attributes = this.getAttributes(tracking_data);
        const payload = {
            data: tracking_data,
            attributes: attributes,
            event: constants.events.pageView,
            process: constants.events.pageView,
            script_id: this.script_id,
            session_id: this.session_id,
            user_info: {
                tracking_id: this.account_tracking_id,
                user_type: Number(this.user_type),
                user_details: {...this.user_details, user_id: this.account_tracking_id,}
            },
            domain_id: this.domain_id,
            fired_at: new Date().toISOString(),
        }
        this.request(constants.endpoints.track, "POST", payload);
    }

    private manageSession(session_state: number): void {
        localStorage.setItem('userplus_session_state', session_state.toString());
        this.session_state = session_state;
         const payload = {
             minsToWait: constants.session.minsToWait,
             session_id: this.session_id,
             session_state: session_state,
             script_id: this.script_id,
             fired_at: new Date().toISOString(),
             process: constants.events.manageSession,
         }
     this.request(constants.endpoints.track , "POST", payload);
    }

    public event(event: string, event_payload: object): void {
        const payload = {
            data: event_payload,
            attributes: this.getAttributes(event_payload),
            event: event,
            process: constants.events.pageView,
            script_id: this.script_id,
            session_id: this.session_id,
            user_info: {
                tracking_id: this.account_tracking_id,
                user_type: Number(this.user_type),
                user_details: {...this.user_details, user_id: this.account_tracking_id,}
            },
            domain_id: this.domain_id,
            fired_at: new Date().toISOString(),
        }
        this.request(constants.endpoints.track, "POST", payload);
    }

    private trackClicks(): void {
        document.addEventListener('click', async (event: Event) => {
            // If session is idle then first make the session active then track the activity
            if(this.session_state === constants.sessionState.idle) {
                this.manageSession(constants.sessionState.active);
            }
            const target = event.target as HTMLElement;
            if(['BUTTON', 'A'].includes(target.tagName)) {
                const eventPayload = {
                    element: target.tagName,
                    text: target?.textContent?.trim() || "",
                    href: target.getAttribute('href') || "",
                    target: target.getAttribute('target') || "",
                    rel: target.getAttribute('rel') || "",
                    class: target.getAttribute('class') || "",
                    id: target.getAttribute('id') || "",
                    attributes: this.getAttributes(target),
                }
                this.event(constants.events.click, eventPayload);
            }
        }, true)
    }

    public async identify(user_id: string, user_payload: Record<string, any>): Promise<void> {
        const anonymous_user_id = this.account_tracking_id;
        if(user_id !== this.account_tracking_id && this.user_type === constants.userType.identified) {
            this.account_tracking_id = user_id;
            this.session_id = await this.createSession(user_id);
        }

        this.account_tracking_id = user_id;
        const isPreviousUserAnonymous = this.user_type === constants.userType.anonymous;
        this.user_type =  constants.userType.identified;
        this.user_details = user_payload;
        localStorage.setItem('userplus_user_id', this.account_tracking_id);
        localStorage.setItem('userplus_user_type', String(constants.userType.identified));
        localStorage.setItem('userplus_user_data', JSON.stringify(user_payload));

        const payload = {
            user_info: { tracking_id: user_id, user_type: constants.userType.identified, user_details: user_payload},
            attributes: this.getAttributes(user_payload),
            fired_at: new Date().toISOString(),
            script_id: this.script_id,
            session_id: this.session_id,
            domain_id: this.domain_id,
            minsToWait: constants.session.minsToWait,
            ...(isPreviousUserAnonymous && {anonymous_tracking_id: anonymous_user_id}),
        }
        this.request(constants.endpoints.identify, "POST", payload);
    }

    private handleUnload(): void {
        window.addEventListener('beforeunload', () => {
                this.deactiveSession()
        })
    }

    private deactiveSession(): void {
        const data = {
            page_url: window.location.href,
            page_title: document.title,
            referrer_url: document.referrer,
            domain: new URL(window.location.href).origin,
            browser_language: navigator.language,
            char_set: document.characterSet,
            device_type: this.getDeviceType(),
        }
        const attributes = this.getAttributes(data);
        const payload = {
            script_id: this.script_id,
            session_id: this.session_id,
            page_url: window.location.href,
            process: constants.events.deactivate,
            fired_at: new Date().toISOString(),
            domain_id: this.domain_id,
            data: data,
            attributes: attributes,
        }

        localStorage.removeItem('userplus_user_id');
        localStorage.removeItem('userplus_user_type');
        localStorage.removeItem('userplus_user_data');
        localStorage.removeItem('userplus_session_state');
        localStorage.removeItem('userplus_session_id');
        this.session_state = constants.sessionState.inactive;
        this.session_id = null;
        this.account_tracking_id = null;
        this.user_type = constants.userType.anonymous;
        this.user_details = null;
        this.domain_id = null;

        this.request(constants.endpoints.track, "POST", payload)
    }

    private trackIdleState(): void {
        let idleTimer: any;
        const resetTimer = () => {
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                if(this.session_state === constants.sessionState.active)
                    this.manageSession(constants.sessionState.idle);
                if(this.session_state === constants.sessionState.inactive)
                    this.manageSession(constants.sessionState.active);
            }, this.IDLE_TIMEOUT); // 1 minute
        };
        ["mousemove", "keydown", "scroll", "click"].forEach(event => {
            window.addEventListener(event, resetTimer);
        });
        resetTimer();
    }

    private trackSPAChanges(): void {
        const observer = new MutationObserver(() => {
            if (window.location.href !== sessionStorage.getItem("last_url")) {
                sessionStorage.setItem("last_url", window.location.href);
                this.trackPageView();
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    }

    private getDeviceType() {
        if (window.screen.width < 768) {
          return 'Mobile';
        } else if (window.screen.width >= 768 && window.screen.width < 1024) {
          return 'Tablet';
        } else if (window.screen.width >= 1024) {
          return 'Desktop';
        }
    }

    private async verifyScript(): Promise<Record<string, any>> {
        const response = await this.request(constants.endpoints.verify, "POST", {
                script_id: this.script_id,
                // current_domain: new URL(window.location.href).origin
            current_domain: "coral-ana-73.tiiny.site"
        });
        return {isVerified: response.status, payload: response.data};
    }

    private async request(endpoint: string, method = 'GET', body: Record<string, any>,): Promise<Record<string, any>> {
        const response = await fetch(this.api_url + endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        return await response.json();
    }

}

(window as any).userplus = {
    init: (script_id: string) => {
        (window as any).userplus = new UserPlus(script_id);
    }
};