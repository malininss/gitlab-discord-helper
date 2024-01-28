import type { MergeWebhookPayload } from 'schemas/webhooks/mergeWebhook/types.js';
import {
  findThreadByStartString,
  getChannelById,
} from '../../helpers/channel.js';
import type { ProjectConfig } from 'core/models/ProjectConfigModel.js';

interface ArchiveThreadParams {
  mrData: MergeWebhookPayload;
  projectConfig: ProjectConfig;
  isMerged?: boolean;
}

export const archiveThread = async ({
  mrData,
  projectConfig,
  isMerged,
}: ArchiveThreadParams): Promise<void> => {
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
