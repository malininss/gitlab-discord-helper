import { Collection, Role } from 'discord.js';

export const getRolesStringForTag = (
  roleCollection: Collection<string, Role> | undefined
): string => {
  if (!roleCollection) {
    return '';
  }

  return roleCollection.map((role) => `<@&${role.id}>`).join(' ');
};
