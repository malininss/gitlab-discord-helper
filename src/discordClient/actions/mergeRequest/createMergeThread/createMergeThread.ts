import type { MergeEventPayload } from 'server';
import { ChannelType, ThreadAutoArchiveDuration } from 'discord.js';
import {
  findThreadByStartString,
  getChannelById,
} from '../../../helpers/channel';
import { getErrorMessage } from 'utils/getErrorMessage';
import { config, type ProjectConfig } from 'config';
import { getRolesStringToTag } from './services/getRolesStringToTag';

export const createMergeThread = async (
  mrData: MergeEventPayload
): Promise<void> => {
  const projectConfig: ProjectConfig | undefined =
    config[String(mrData.project.id)];

  if (!projectConfig) {
    console.error('projectInfo data not found');
    return;
  }

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
    console.error('Channel is not a guild text channel');
    return;
  }

  try {
    await discordChannel.threads.create({
      name: `!${mrData.objectAttributes.iid} ${mrData.objectAttributes.title}`,
      autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
      message: {
        content: `${mrData.user.name} created MR:\n${mrData.objectAttributes.url}\n\nPlease, check it. ${tagsString}`,
      },
    });
  } catch (error) {
    console.error('Creation thread error: ', getErrorMessage(error));
  }
};
