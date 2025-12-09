// src/env.d.ts
interface ImportMetaEnv {
    readonly API_KEY: string;
    readonly API_SECRET: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare const process: {
    env: {
        API_KEY: string;
        API_SECRET: string;
        [key: string]: string | undefined;
    };
};