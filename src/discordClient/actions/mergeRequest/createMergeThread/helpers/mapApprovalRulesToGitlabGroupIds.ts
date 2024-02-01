import type { GetApprovalRulesPayload } from 'api/gitLab';

export const mapApprovalRulesToGitlabGroupIds = (
  approvalRules: GetApprovalRulesPayload
): string[] => {
  const gitlabApprovalGroupIds = new Set<string>();

  approvalRules.forEach((rule) => {
    rule.groups.forEach((group) => {
      gitlabApprovalGroupIds.add(group.id.toString());
    });
  });

  return [...gitlabApprovalGroupIds];
};
