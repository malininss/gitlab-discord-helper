import { Client, IntentsBitField, Partials } from 'discord.js';

/**
 * see https://discord.com/developers/docs/topics/gateway#list-of-intents
 */

let client: Client | undefined;

export const initDiscordClient = async () => {
  client = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildPresences,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.MessageContent,
      IntentsBitField.Flags.DirectMessages,
    ],
    partials: [Partials.Channel, Partials.Message],
  });

  client.on('ready', (c) => {
    console.log(`🚀 ${c.user.tag} bot is ready`);
  });

  return client.login(process.env.BOT_OAUTH_KEY);
};

export const getDiscordClient = () => {
  if (!client) {
    throw new Error('client not initialized');
  }

  return client;
};
