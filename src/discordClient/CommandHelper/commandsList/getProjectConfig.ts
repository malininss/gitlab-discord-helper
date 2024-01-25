import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../types';
import { OptionName, SlashCommandName } from '../enums';
import { projectConfigService } from 'core/services/projectConfigService';
import type { WithId } from 'mongodb';
import type { ProjectConfig } from 'core/models/ProjectConfigModel';
import { getErrorMessage } from 'discordClient/helpers/getErrorMessage';

const createProjectConfigMessage = (
  config: WithId<ProjectConfig>,
  gitlabProjectId: string
): string => {
  const rolesToTagEntries = Object.entries(config.rolesToTag ?? {});

  const rolesToTagMessage =
    rolesToTagEntries.length > 0
      ? rolesToTagEntries
          .map(([key, value]) => {
            const rolesList =
              value && value.length > 0 ? value.join(', ') : 'None';
            return `  - ${key}: ${rolesList}`;
          })
          .join('\n')
      : 'No roles to tag.\n';

  return [
    `Project Config for gitlab project id "${gitlabProjectId}":`,
    `- Discord Forum ID to Post MR Info: "${
      config.forumIdToPostMrInfo || 'Not specified'
    }"`,
    `- Roles to Tag: \n${rolesToTagMessage}`,
  ].join('\n');
};

export const getProjectConfig: Command = {
  data: new SlashCommandBuilder()
    .setName(SlashCommandName.GetProjectConfig)
    .setDescription('Config for specific gitlab project')
    .addStringOption((option) =>
      option
        .setName(OptionName.GitlabProjectId)
        .setDescription('Enter gitlab project id')
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const gitlabProjectId = interaction.options.getString(
      OptionName.GitlabProjectId
    );

    if (!gitlabProjectId) {
      return;
    }

    try {
      const config = await projectConfigService.getProjectConfig(
        gitlabProjectId
      );

      const message = createProjectConfigMessage(config, gitlabProjectId);

      await interaction.reply({ content: message, ephemeral: true });
    } catch (error) {
      await interaction.reply({
        content: getErrorMessage(error),
        ephemeral: true,
      });
    }
  },
};
