declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string | undefined;
    BOT_OAUTH_KEY: string | undefined;
    SERVER_ID: string | undefined;
  }
}
