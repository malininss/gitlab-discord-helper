import { getDiscordClient } from '../client';

export const getRoleNameById = (roleId: string): string | undefined => {
  const client = getDiscordClient();
  const guild = client.guilds.cache.get(process.env.SERVER_ID);

  const role = guild?.roles.cache.get(roleId);
  return role?.name;
};

export const transformRoleIdsStringToTag = (rolesIds: string[]): string =>
  rolesIds?.map((roleId) => `<@&${roleId}>`).join(', ');
