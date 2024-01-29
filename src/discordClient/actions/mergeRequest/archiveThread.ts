import type { MergeWebhookPayload } from 'schemas/webhooks/mergeWebhook/types';
import {
  findThreadByStartString,
  getChannelById,
} from '../../helpers/channel';
import { projectConfigService } from 'core/services/projectConfigService';

export const archiveThread = async (
  mrData: MergeWebhookPayload,
  isMerged?: boolean
): Promise<void> => {
  const projectConfig = await projectConfigService.getProjectConfig(
    String(mrData.project.id)
  );

  const discordChannel = await getChannelById(
    projectConfig.forumIdToPostMrInfo
  );

  const thread =
    discordChannel &&
    (await findThreadByStartString(
      discordChannel,
      `!${mrData.objectAttributes.iid}`
    ));

  if (!thread) {
    return;
  }

  const statusEmoji = isMerged ? '✅' : '❌';
  await thread.setName(`${statusEmoji} ${thread.name}`);
};
