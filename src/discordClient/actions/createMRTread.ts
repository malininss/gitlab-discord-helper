import { ChannelType, ThreadAutoArchiveDuration } from 'discord.js';
import { WebhookMRPayload } from '../../schemas/webHooks/MRWebhook/types.js';
import { getChannelById } from '../helpers/getChannelById.js';
import { getRoleCollectionByNames } from '../helpers/getRoleCollectionByNames.js';
import projectsConfig from '../../../projectsConfig.json' assert { type: 'json' };
import { ProjectConfig, ProjectConfigKeys } from '../../type.js';
import { getRolesStringForTag } from '../helpers/getRolesStringForTag.js';

export const createMRTread = async (mrData: WebhookMRPayload) => {
  const projectConfig: ProjectConfig | undefined =
    projectsConfig[String(mrData.project.id) as ProjectConfigKeys];

  if (!projectConfig) {
    console.error('projectInfo data not found');
    return;
  }

  const discordChannel = await getChannelById(
    projectConfig.forumIdToPostMrInfo
  );
  const tagString = getRolesStringForTag(
    getRoleCollectionByNames(projectConfig.rolesToTag)
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
        content: `${mrData.user.name} created MR:\n${mrData.objectAttributes.url}\n\nPlease, check it. ${tagString}`,
      },
    });
  } catch (error) {
    console.error('Something went wrong when creating a thread');
  }
};
