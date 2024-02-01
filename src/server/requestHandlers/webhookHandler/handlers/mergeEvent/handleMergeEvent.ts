import {
  archiveThread,
  createMergeThread,
  sendApproveInfoToThread,
} from 'discordClient/actions';
import { MergeWebhookActions } from 'server/requestHandlers/webhookHandler/handlers/mergeEvent/enums';
import { getErrorMessage } from 'utils/getErrorMessage';
import type { BodyWithType } from '../../types';
import { schema } from './schema';
import { WebhookEventType } from '../../enums';

export const handleMergeEvent = async (body: BodyWithType): Promise<void> => {
  if (body.eventType !== WebhookEventType.MergeRequest) {
    const mergeRequestInfo = schema.parse(body);
    return handleMergeEvent(mergeRequestInfo);
  }

  const mergeRequestInfo = schema.parse(body);

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
