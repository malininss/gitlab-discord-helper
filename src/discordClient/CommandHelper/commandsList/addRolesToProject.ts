import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../types';
import { OptionName, SlashCommandName } from '../enums';

export const addRolesToProject: Command = {
  data: new SlashCommandBuilder()
    .setName(SlashCommandName.AddRolesToProject)
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
    ),
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;
    const roleId =
      interaction.options.getRole(OptionName.RolesToTagInProject)?.id ?? 'null';

    const message = `roleId: ${roleId}`;

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(message);
    } else {
      await interaction.reply(message);
    }
  },
};
