import type { MergeWebhookPayload } from 'schemas/webhooks/mergeWebhook/types.js';
import { ChannelType, ThreadAutoArchiveDuration } from 'discord.js';
import { findThreadByStartString, getChannelById } from '../../helpers/channel.js';
import { getErrorMessage } from 'utils/getErrorMessage.js';
import { getRolesStringToTag } from 'discordClient/helpers/role.js';
import { projectConfigService } from 'core/services/projectConfigService.js';

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

  const commonTagString = getRolesStringToTag(projectConfig.rolesToTag?.all);

  const firstTitleWork = mrData.objectAttributes.title.split(' ')[0];
  const specificRolesToTagArray = projectConfig.rolesToTag?.[firstTitleWork];

  const specificTagString = getRolesStringToTag(specificRolesToTagArray);

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
