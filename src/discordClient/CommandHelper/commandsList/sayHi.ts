import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../types';
import { SlashCommandName } from '../enums';
import { getErrorMessage } from 'utils/getErrorMessage';

export enum OptionName {
  Name = 'name',
}

export const sayHi: Command = {
  data: new SlashCommandBuilder()
    .setName(SlashCommandName.SayHi)
    .setDescription('Send greeting message')
    .addStringOption((option) =>
      option
        .setName(OptionName.Name)
        .setDescription('Enter name to say hi')
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const name = interaction.options.getString(OptionName.Name);

    if (!name) {
      return;
    }

    try {
      await interaction.reply({ content: `Hi ${name}!`, ephemeral: true });
    } catch (error) {
      await interaction.reply({
        content: getErrorMessage(error),
        ephemeral: true,
      });
    }
  },
};
