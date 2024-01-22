import { initDiscordClient } from 'discordClient/index.js';
import { MongoDbClient } from 'server/db/MongoDbClient';
import { initServer } from 'server/index.js';

await MongoDbClient.getInstance();
await initDiscordClient();
initServer();
