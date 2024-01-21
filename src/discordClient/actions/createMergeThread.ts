import type { MergeWebhookPayload } from 'schemas/webhooks/mergeWebhook/types.js';
import type { ProjectConfig, ProjectConfigKeys } from 'config/type.js';

import projectsConfig from 'config/projectsConfig.json' assert { type: 'json' };
import { ChannelType, ThreadAutoArchiveDuration } from 'discord.js';
import { getChannelById } from '../helpers/channel.js';
import {
  getRolesStringForTag,
  getRoleCollectionByNames,
} from '../helpers/role.js';

export const createMergeThread = async (
  mrData: MergeWebhookPayload
): Promise<void> => {
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
