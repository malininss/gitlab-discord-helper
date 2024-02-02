import type { MergeEventPayload } from 'server';
import { findThreadByStartString, getChannelById } from '../../helpers/channel';
import { getProjectConfigByGitlabProjectId } from 'discordClient/services/getProjectConfigByGitlabProjectId';

export const archiveThread = async (
  mrData: MergeEventPayload,
  isMerged?: boolean
): Promise<void> => {
  const projectConfig = getProjectConfigByGitlabProjectId(mrData.project.id);

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
  await thread.setArchived(true);
};
