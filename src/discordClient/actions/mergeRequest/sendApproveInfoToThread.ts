import type { MergeWebhookPayload } from 'schemas/webhooks/mergeWebhook/types.js';
import {
  findThreadByStartString,
  getChannelById,
} from '../../helpers/channel.js';
import type { ProjectConfig } from 'core/models/ProjectConfigModel.js';

export const sendApproveInfoToThread = async (
  mrData: MergeWebhookPayload,
  projectConfig: ProjectConfig
): Promise<void> => {
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
