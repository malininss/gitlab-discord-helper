import { ChannelType, type AnyThreadChannel, type Channel } from 'discord.js';
import { getDiscordClient } from '../client.js';

export const getChannelById = async (id: string): Promise<Channel | null> => {
  const client = getDiscordClient();
  const channel = await client.channels.fetch(id);

  return channel;
};

export const findThreadByStartString = async (
  channel: Channel,
  startString: string
): Promise<AnyThreadChannel | undefined> => {
  if (channel?.type !== ChannelType.GuildForum) {
    return;
  }

  const { threads } = await channel.threads.fetchActive();
  return threads.find((thread) => thread.name.startsWith(startString));
};
