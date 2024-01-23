declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    BOT_OAUTH_KEY: string;
    SERVER_ID: string;
    MONGO_DB_URL: string;
    BOT_ID: string;
  }
}
