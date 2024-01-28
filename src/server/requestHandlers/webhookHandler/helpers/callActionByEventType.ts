import { WebhookEventType } from 'schemas/webhooks/enums';
import { handleMergeEvent } from '../handlers/handleMergeEvent';
import { MergeWebhookPayloadSchema } from 'schemas/webhooks/mergeWebhook/WebhookMRPayloadSchema';

const checkHasMergeEventType = (
  obj: unknown
): obj is { eventType: WebhookEventType } =>
  obj !== null && typeof obj === 'object' && 'eventType' in obj;

export const callActionByEventType = (
  body: unknown
): Promise<void> | undefined => {
  if (!checkHasMergeEventType(body)) {
    return;
  }

  if (body.eventType === WebhookEventType.MergeRequest) {
    const mergeRequestInfo = MergeWebhookPayloadSchema.parse(body);
    return handleMergeEvent(mergeRequestInfo);
  }
};
