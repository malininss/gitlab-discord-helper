import { MongoClient, Db } from 'mongodb';

export const DB_NAME = 'gitlab-discord-helper';

export class MongoDbClient {
  private static instance: MongoDbClient;
  private dbClient: MongoClient;
  private dbName: string;

  private constructor() {
    this.dbName = DB_NAME;

    this.dbClient = new MongoClient(
      `${process.env.MONGO_DB_URL}:${process.env.MONGO_DB_PORT}/${this.dbName}?authSource=admin`,
      {
        auth: {
          username: process.env.MONGO_INITDB_ROOT_USERNAME,
          password: process.env.MONGO_INITDB_ROOT_PASSWORD,
        },
      }
    );
  }

  public static async getInstance(): Promise<MongoDbClient> {
    if (!MongoDbClient.instance) {
      const client = new MongoDbClient();

      await client.dbClient.connect();
      MongoDbClient.instance = client;
    }

    return MongoDbClient.instance;
  }

  public getDb(): Db {
    return this.dbClient.db(this.dbName);
  }

  public async close(): Promise<void> {
    await this.dbClient.close();
  }
}
