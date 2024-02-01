declare namespace NodeJS {
  interface ProcessEnv {
    GITLAB_ACCESS_TOKEN: string;
    SERVER_PORT: string;
    BOT_OAUTH_KEY: string;
    SERVER_ID: string;
    BOT_ID: string;
    MONGO_DB_URL: string;
    MONGO_DB_PORT: string;
    MONGO_INITDB_ROOT_USERNAME: string;
    MONGO_INITDB_ROOT_PASSWORD: string;
  }
}
