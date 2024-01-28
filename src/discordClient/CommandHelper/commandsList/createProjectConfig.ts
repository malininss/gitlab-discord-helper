import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../types';
import { OptionName, SlashCommandName } from '../enums';
import { projectConfigService } from 'core/services/projectConfigService';
import { getErrorMessage } from 'utils/getErrorMessage';

export const createProjectConfig: Command = {
  data: new SlashCommandBuilder()
    .setName(SlashCommandName.CreateProjectConfig)
    .setDescription('Creates configuration for project by gitlab project id')
    .addStringOption((option) =>
      option
        .setName(OptionName.GitlabProjectId)
        .setDescription('Enter gitlab project id')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName(OptionName.DiscordForumId)
        .setDescription('Enter forum id to post MR info')
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;
    const gitlabProjectId = interaction.options.getString(
      OptionName.GitlabProjectId
    );
    const discordForumId = interaction.options.getString(
      OptionName.DiscordForumId
    );

    if (!gitlabProjectId || !discordForumId) {
      return;
    }

    try {
      await projectConfigService.upsertProjectConfig(
        gitlabProjectId,
        discordForumId
      );
      await interaction.reply({
        content: `Project with id "${gitlabProjectId}" successfully connected with the discord forum "${discordForumId}"`,
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
