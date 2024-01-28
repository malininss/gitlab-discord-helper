import { projectConfigService } from 'core/services/projectConfigService';
import { archiveThread } from 'discordClient/actions/mergeRequest/archiveThread';
import { createMergeThread } from 'discordClient/actions/mergeRequest/createMergeThread';
import { sendApproveInfoToThread } from 'discordClient/actions/mergeRequest/sendApproveInfoToThread';
import { MergeWebhookActions } from 'schemas/webhooks/mergeWebhook/enums';
import type { MergeWebhookPayload } from 'schemas/webhooks/mergeWebhook/types';
import { getErrorMessage } from 'utils/getErrorMessage';

export const handleMergeEvent = async (
  mergeRequestInfo: MergeWebhookPayload
): Promise<void> => {
  const { action } = mergeRequestInfo.objectAttributes;
  if (!action) {
    return;
  }

  const projectConfig = await projectConfigService.getProjectConfig(
    String(mergeRequestInfo.project.id)
  );

  const actionsMap: Partial<
    Record<MergeWebhookActions, () => Promise<void> | undefined>
  > = {
    [MergeWebhookActions.Open]: () =>
      createMergeThread(mergeRequestInfo, projectConfig),
    [MergeWebhookActions.Update]: () =>
      mergeRequestInfo.changes?.draft?.previous === true &&
      mergeRequestInfo.changes?.draft?.current === false
        ? createMergeThread(mergeRequestInfo, projectConfig)
        : undefined,
    [MergeWebhookActions.Approved]: () =>
      sendApproveInfoToThread(mergeRequestInfo, projectConfig),
    [MergeWebhookActions.Close]: () =>
      archiveThread({
        mrData: mergeRequestInfo,
        projectConfig,
        isMerged: false,
      }),
    [MergeWebhookActions.Merge]: () =>
      archiveThread({
        mrData: mergeRequestInfo,
        projectConfig,
        isMerged: true,
      }),
  };

  try {
    const actionFunction = actionsMap[action];
    await actionFunction?.();
  } catch (error) {
    console.error(getErrorMessage(error));
  }
};
