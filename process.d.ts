declare namespace NodeJS {
  export interface ProcessEnv {
    TZ: string;
    NODE_ENV: string;
    PORT: string;
    API_SECRET: string;
    MONGO_DB: string;
  }
}
