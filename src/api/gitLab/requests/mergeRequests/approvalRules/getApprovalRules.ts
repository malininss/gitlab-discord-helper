import { GitlabApiClient } from 'api/gitLab/GitlabApiClient';
import { approvalRulesSchema } from './schema';
import type { GetApprovalRulesPayload } from './types';
import { transformKeysToCamelCase } from 'utils/transformKeysToCamelCase';

export const getApprovalRules = async (
  projectName: string,
  mergeRequestId: string
): Promise<GetApprovalRulesPayload> => {
  const requestResult = await GitlabApiClient.makeRequest(
    `${encodeURIComponent(
      projectName
    )}/merge_requests/${mergeRequestId}/approval_rules`
  );

  return approvalRulesSchema.parse(transformKeysToCamelCase(requestResult));
};
