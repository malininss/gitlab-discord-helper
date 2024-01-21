import { Collection, Role } from 'discord.js';
import { getDiscordClient } from '../client.js';

const serverId = process.env.SERVER_ID;
if (!serverId) {
  throw new Error('SERVER_ID is not defined in .env file');
}

export const getRoleCollectionByNames = (
  rolesNames: string[]
): Collection<string, Role> | undefined => {
  const client = getDiscordClient();
  const guild = client.guilds.cache.get(serverId);

  const roleCollection = guild?.roles.cache.filter((role) =>
    rolesNames.includes(role.name)
  );

  return roleCollection;
};

export const getRolesStringForTag = (
  roleCollection: Collection<string, Role> | undefined
): string => {
  if (!roleCollection) {
    return '';
  }

  return roleCollection.map((role) => `<@&${role.id}>`).join(' ');
};
