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

  const actionsMap: Partial<
    Record<MergeWebhookActions, () => Promise<void> | undefined>
  > = {
    [MergeWebhookActions.Open]: () =>
      !mergeRequestInfo.objectAttributes.draft
        ? createMergeThread(mergeRequestInfo)
        : undefined,
    [MergeWebhookActions.Update]: () =>
      mergeRequestInfo.changes?.draft?.previous === true &&
      mergeRequestInfo.changes?.draft?.current === false
        ? createMergeThread(mergeRequestInfo)
        : undefined,
    [MergeWebhookActions.Approved]: () =>
      sendApproveInfoToThread(mergeRequestInfo),
    [MergeWebhookActions.Close]: () => archiveThread(mergeRequestInfo, false),
    [MergeWebhookActions.Merge]: () => archiveThread(mergeRequestInfo, true),
  };

  try {
    const actionFunction = actionsMap[action];
    await actionFunction?.();
  } catch (error) {
    console.error(getErrorMessage(error));
  }
};
