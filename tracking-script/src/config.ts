// Define the interface for API services
interface ApiServices {
    TRACKING: string | undefined;
    IP_TRACKING: string | undefined;
}

// Define the interface for the entire config object
interface Config {
    API_SERVICES: ApiServices;
}

const config: Config = {
    API_SERVICES: {
        TRACKING: "https://userplus.io/api/new-tracking",
        IP_TRACKING: "https://pro.ip-api.com/json/?fields=66842623&key=82LH3HgJ6w0DP7N"
    }
}

export default config;