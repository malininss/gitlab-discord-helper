import { getDiscordClient } from '../client.js';

export const getRoleNameById = (roleId: string): string | undefined => {
  const client = getDiscordClient();
  const guild = client.guilds.cache.get(process.env.SERVER_ID);

  const role = guild?.roles.cache.get(roleId);
  return role?.name;
};

export const getRolesStringToTag = (rolesIds?: string[]): string | undefined =>
  rolesIds?.map((roleId) => `<@&${roleId}>`).join(', ');
