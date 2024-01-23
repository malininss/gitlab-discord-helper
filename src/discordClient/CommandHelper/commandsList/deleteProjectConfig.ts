import type { Command } from '../types';
import { SlashCommandBuilder } from 'discord.js';
import { OptionName, SlashCommandName } from '../enums';

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

    const message = `gitlabProjectId: ${gitlabProjectId}`;
    await interaction.reply(message);
  },
};
