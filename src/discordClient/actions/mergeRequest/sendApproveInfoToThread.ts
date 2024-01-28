import type { MergeWebhookPayload } from 'schemas/webhooks/mergeWebhook/types.js';
import { findThreadByStartString, getChannelById } from '../../helpers/channel.js';
import { projectConfigService } from 'core/services/projectConfigService.js';

export const sendApproveInfoToThread = async (
  mrData: MergeWebhookPayload
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

  await thread.send(`👍 MR approved by ${mrData.user.name}`);
};
