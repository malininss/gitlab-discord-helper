import type { Channel } from 'discord.js';
import { getDiscordClient } from '../client.js';

export const getChannelById = async (id: string): Promise<Channel | null> => {
  const client = getDiscordClient();
  const channel = await client.channels.fetch(id);

  return channel;
};
