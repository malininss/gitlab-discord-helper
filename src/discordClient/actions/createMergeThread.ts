import type { MergeWebhookPayload } from 'schemas/webhooks/mergeWebhook/types.js';
import type { ProjectConfig } from 'core/models/ProjectConfigModel.js';
import { ChannelType, ThreadAutoArchiveDuration } from 'discord.js';
import { getChannelById } from '../helpers/channel.js';
import { MongoDbClient } from 'core/db/MongoDbClient.js';
import type { WithId } from 'mongodb';
import { getRolesStringToTag } from 'discordClient/helpers/role.js';

const getProjectConfig = async (
  gitlabProjectId: string
): Promise<WithId<ProjectConfig> | null> => {
  const client = await MongoDbClient.getInstance();
  const db = client.getDb();

  const projectConfig = await db
    .collection<ProjectConfig>('projectConfigs')
    .findOne({ gitlabProjectId });

  return projectConfig;
};

export const createMergeThread = async (
  mrData: MergeWebhookPayload
): Promise<void> => {
  const projectConfig = await getProjectConfig(String(mrData.project.id));

  if (!projectConfig) {
    console.error(
      `Project configuration with gitlab id ${mrData.project.id} not found`
    );
    return;
  }

  const discordChannel = await getChannelById(
    projectConfig.forumIdToPostMrInfo
  );

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
    console.error('Something went wrong when creating a thread');
  }
};
