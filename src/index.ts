import { initDiscordClient } from 'discordClient/index.js';
import { initServer } from 'server/index.js';

await initDiscordClient();
initServer();
