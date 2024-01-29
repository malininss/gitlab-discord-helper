import type { MergeWebhookPayload } from 'schemas/webhooks/mergeWebhook/types';
import { ChannelType, ThreadAutoArchiveDuration } from 'discord.js';
import { findThreadByStartString, getChannelById } from '../../helpers/channel';
import { getErrorMessage } from 'utils/getErrorMessage';
import { getRolesStringToTag } from 'discordClient/helpers/role';
import { projectConfigService } from 'core/services/projectConfigService';

const ALL_ROLES_KEY = 'all';

export const createMergeThread = async (
  mrData: MergeWebhookPayload
): Promise<void> => {
  const projectConfig = await projectConfigService.getProjectConfig(
    String(mrData.project.id)
  );

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

  const commonTagString = getRolesStringToTag(
    projectConfig.rolesToTag?.[ALL_ROLES_KEY]
  );

  const specificRoleGroupForTag = Object.keys(
    projectConfig.rolesToTag ?? {}
  ).find((part) => mrData.objectAttributes.title.startsWith(part));

  const specificTagString =
    specificRoleGroupForTag &&
    getRolesStringToTag(projectConfig.rolesToTag?.[specificRoleGroupForTag]);

  const tagString = [commonTagString, specificTagString]
    .filter(Boolean)
    .join(', ');

  if (discordChannel?.type !== ChannelType.GuildForum) {
    console.error('Channel is not a guild text channel');
    return;
  }

  try {
    await discordChannel.threads.create({
      name: `!${mrData.objectAttributes.iid} ${mrData.objectAttributes.title}`,
      autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
      message: {
        content: `${mrData.user.name} created MR:\n${mrData.objectAttributes.url}\n\nPlease, check it. ${tagString}`,
      },
    });
  } catch (error) {
    console.error('Creation thread error: ', getErrorMessage(error));
  }
};
