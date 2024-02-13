import type { MergeEventPayload } from 'server';
import { ChannelType, ThreadAutoArchiveDuration } from 'discord.js';
import {
  findThreadByStartString,
  getChannelById,
} from '../../../helpers/channel';
import { getRolesStringToTag } from './services/getRolesStringToTag';
import { getProjectConfigByGitlabProjectId } from 'discordClient/services/getProjectConfigByGitlabProjectId';

export const createMergeThread = async (
  mrData: MergeEventPayload
): Promise<void> => {
  const projectConfig = getProjectConfigByGitlabProjectId(mrData.project.id);

  const discordChannel = await getChannelById(
    projectConfig.forumIdToPostMrInfo
  );

  if (!discordChannel) {
    return;
  }

  const isAlreadyCreated = await findThreadByStartString(
    discordChannel,
    `!${mrData.objectAttributes.iid}`
  );

  if (isAlreadyCreated) {
    return;
  }

  const tagsString = await getRolesStringToTag(
    projectConfig,
    mrData.project.pathWithNamespace,
    mrData.objectAttributes.iid.toString()
  );

  if (discordChannel?.type !== ChannelType.GuildForum) {
    throw new Error('Channel is not a guild text channel');
  }

  const thread = await discordChannel.threads.create({
    name: `!${mrData.objectAttributes.iid} ${mrData.objectAttributes.title}`,
    autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
    message: {
      content: `${mrData.user.name} created MR:\n${mrData.objectAttributes.url}\n\nPlease, check it. ${tagsString}`,
    },
  });

  const messages = await thread.messages.fetch({ limit: 1 });
  await messages.first()?.pin();
};
