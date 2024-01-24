import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../types';
import { OptionName, SlashCommandName } from '../enums';
import { projectConfigService } from 'core/services/projectConfigService';

export const deleteProjectConfig: Command = {
  data: new SlashCommandBuilder()
    .setName(SlashCommandName.deleteProjectConfig)
    .setDescription('Delete configuration for project by gitlab project id')
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
      await projectConfigService.deleteProjectConfig(gitlabProjectId);
      await interaction.reply(
        `Project with id "${gitlabProjectId}" successfully deleted`
      );
    } catch (error) {
      await interaction.reply(`${error as string} `);
    }
  },
};
