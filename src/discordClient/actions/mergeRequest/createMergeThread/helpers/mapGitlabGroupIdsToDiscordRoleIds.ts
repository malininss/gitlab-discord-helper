import type { ProjectConfig } from 'config';

export const mapGitlabGroupIdsToDiscordRoleIds = (
  projectConfig: ProjectConfig,
  gitlabGroupIds: string[]
): string[] => {
  const result: string[] = [];

  const gitlabGroupIdToDiscordRoleIdMap =
    projectConfig.gitlabGroupIdToDiscordRoleIdMap;

  gitlabGroupIds.forEach((gitlabGroupId) => {
    const discordRoleId = gitlabGroupIdToDiscordRoleIdMap[gitlabGroupId];

    if (discordRoleId) {
      result.push(discordRoleId);
    }
  });

  return result;
};
