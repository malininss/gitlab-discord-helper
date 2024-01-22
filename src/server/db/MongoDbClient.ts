import { MongoClient, Db } from 'mongodb';

export const DB_NAME = 'gitlab-discord-helper';

export class MongoDbClient {
  private static instance: MongoDbClient;
  private dbClient: MongoClient;
  private dbName: string;

  private constructor() {
    this.dbName = DB_NAME;
    const mongoDbUrl = process.env.MONGO_DB_URL;

    if (!mongoDbUrl) {
      throw new Error('MONGO_DB_URL is not defined in process.env');
    }

    this.dbClient = new MongoClient(`${mongoDbUrl}/${this.dbName}`);
  }

  private async initDb(): Promise<void> {
    const db = this.getDb();

    const isUsersCollectionExist = await db
      .listCollections({ name: 'projects' }, { nameOnly: true })
      .hasNext();

    if (!isUsersCollectionExist) {
      await db.createCollection('projects');
      console.log('project collection created');
    }
  }

  public static async getInstance(): Promise<MongoDbClient> {
    if (!MongoDbClient.instance) {
      const client = new MongoDbClient();

      await client.dbClient.connect();
      await client.initDb();

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
