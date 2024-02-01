import { WebhookEventType } from '../enums';
import { handleMergeEvent } from '../handlers/mergeEvent/handleMergeEvent';
import type { BodyWithType } from '../types';

const checkIfHasEvenType = (obj: unknown): obj is BodyWithType =>
  obj !== null && typeof obj === 'object' && 'eventType' in obj;

export const handleByEvenType = (body: unknown): Promise<void> | undefined => {
  if (!checkIfHasEvenType(body)) {
    return;
  }

  if (body.eventType === WebhookEventType.MergeRequest) {
    return handleMergeEvent(body);
  }
};
