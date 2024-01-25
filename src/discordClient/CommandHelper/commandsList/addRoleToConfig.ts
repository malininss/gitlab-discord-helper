import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../types';
import { OptionName, SlashCommandName } from '../enums';
import { projectConfigService } from 'core/services/projectConfigService';
import { getErrorMessage } from 'discordClient/helpers/getErrorMessage';

export const addRoleToConfig: Command = {
  data: new SlashCommandBuilder()
    .setName(SlashCommandName.AddRolesToConfig)
    .setDescription('Add roles for project id to tag them')
    .addStringOption((option) =>
      option
        .setName(OptionName.GitlabProjectId)
        .setDescription('Enter gitlab project id')
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName(OptionName.RolesToTagInProject)
        .setDescription('The role to tag')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName(OptionName.SpecificyOfRole)
        .setDescription(
          'The project name or other. For example project name from Jira'
        )
    ),
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const gitlabProjectId = interaction.options.getString(
      OptionName.GitlabProjectId
    );

    const roleId =
      interaction.options.getRole(OptionName.RolesToTagInProject)?.id ?? 'null';

    const specificityOfRole = interaction.options.getString(
      OptionName.SpecificyOfRole
    );

    if (!gitlabProjectId || !roleId) {
      return;
    }

    try {
      await projectConfigService.addRoleToConfig(
        gitlabProjectId,
        roleId,
        specificityOfRole
      );
      await interaction.reply({
        content: `Role with ID "${roleId}" added for the project with gitlab id "${gitlabProjectId}" with specificy "${
          specificityOfRole ?? 'all'
        }"`,
        ephemeral: true,
      });
    } catch (error) {
      await interaction.reply({
        content: getErrorMessage(error),
        ephemeral: true,
      });
    }
  },
};
