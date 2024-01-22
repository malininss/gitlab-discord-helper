declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string | undefined;
    BOT_OAUTH_KEY: string | undefined;
    SERVER_ID: string | undefined;
    MONGO_DB_URL: string | undefined;
  }
}
