import { getApprovalRules } from 'api/gitLab';
import { mapApprovalRulesToGitlabGroupIds } from '../helpers/mapApprovalRulesToGitlabGroupIds';
import { mapGitlabGroupIdsToDiscordRoleIds } from '../helpers/mapGitlabGroupIdsToDiscordRoleIds';
import type { ProjectConfig } from 'config';
import { transformRoleIdsStringToTag } from 'discordClient/helpers/role';

export const getRolesStringToTag = async (
  projectConfig: ProjectConfig,
  projectPath: string,
  mrId: string
): Promise<string> => {
  const approvalRules = await getApprovalRules(projectPath, mrId);

  const gitlabApprovalGroupIds =
    mapApprovalRulesToGitlabGroupIds(approvalRules);

  const discordIdsToTag = mapGitlabGroupIdsToDiscordRoleIds(
    projectConfig,
    gitlabApprovalGroupIds
  );

  return transformRoleIdsStringToTag(discordIdsToTag);
};
