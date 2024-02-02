import type { Command } from './types';
import { REST, Routes } from 'discord.js';
import { sayHi } from './commandsList/sayHi';

export class CommandHelper {
  static commands: Command[] = [sayHi];

  static getCommandByName = (name: string): Command | undefined =>
    this.commands.find((command) => command.data.name === name);

  static registerCommands = async (): Promise<void> => {
    const commandsData = this.commands.map((command) => command.data);

    const rest = new REST({ version: '10' }).setToken(
      process.env.BOT_OAUTH_KEY
    );

    try {
      console.log('Started refreshing application (/) commands.');

      await rest.put(Routes.applicationCommands(process.env.BOT_ID), {
        body: commandsData,
      });

      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error('Failed to reload application (/) commands:', error);
      process.exit(1);
    }
  };
}
