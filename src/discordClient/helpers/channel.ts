import { getDiscordClient } from '../client.js';

export const getChannelById = async (id: string) => {
  const client = getDiscordClient();
  const channel = await client.channels.fetch(id);

  return channel;
};
