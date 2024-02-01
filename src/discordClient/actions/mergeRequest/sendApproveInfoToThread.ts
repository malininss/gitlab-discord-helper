import type { MergeEventPayload } from 'server';
import { findThreadByStartString, getChannelById } from '../../helpers/channel';
import { projectConfigService } from 'core/services/projectConfigService';

export const sendApproveInfoToThread = async (
  mrData: MergeEventPayload
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
