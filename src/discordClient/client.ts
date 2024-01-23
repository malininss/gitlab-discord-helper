import { Client, IntentsBitField, Partials } from 'discord.js';
import { CommandHelper } from './CommandHelper';

/**
 * see https://discord.com/developers/docs/topics/gateway#list-of-intents
 */

let client: Client | undefined;

export const initDiscordClient = async (): Promise<void> => {
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

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = CommandHelper.getCommandByName(interaction.commandName);

    if (!command) {
      return;
    }

    await command.execute(interaction);
  });

  try {
    await client.login(process.env.BOT_OAUTH_KEY);
  } catch (error) {
    console.log('discord login error:', error);
  }
};

export const getDiscordClient = (): Client<boolean> => {
  if (!client) {
    throw new Error('client not initialized');
  }

  return client;
};
