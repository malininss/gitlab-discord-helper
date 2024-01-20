import 'dotenv/config';
import { initDiscordClient } from './discordClient/index.js';
import { initServer } from './server/server.js';

await initDiscordClient();
initServer();
