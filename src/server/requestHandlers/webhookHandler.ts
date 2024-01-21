import type { Request, Response } from 'express';

import { createMergeThread } from 'discordClient/actions/createMergeThread.js';
import { transformKeysToCamelCase } from 'utils/transformKeysToCamelCase.js';
import { MergeWebhookPayloadSchema } from 'schemas/webhooks/mergeWebhook/WebhookMRPayloadSchema.js';
import { WebhookEventType } from 'schemas/webhooks/enums.js';
import { MergeWebhookActions } from 'schemas/webhooks/mergeWebhook/enums.js';

const checkIsMergeEventType = (
  obj: unknown
): obj is { eventType: WebhookEventType } =>
  obj !== null && typeof obj === 'object' && 'eventType' in obj;

export const webhookHandler = (req: Request, res: Response): void => {
  const body = transformKeysToCamelCase(req.body);

  if (
    checkIsMergeEventType(body) &&
    body.eventType !== WebhookEventType.MergeRequest
  ) {
    return;
  }

  const MRInfo = MergeWebhookPayloadSchema.parse(body);
  /**
   * in test trigger there is no MRInfo.objectAttributes.action
   * TODO: remove condition !MRInfo.objectAttributes.action before release
   */
  if (
    !MRInfo.objectAttributes.action ||
    MRInfo.objectAttributes.action === MergeWebhookActions.Open
  ) {
    createMergeThread(MRInfo).catch((error) => console.error(error));
  }

  res.status(200).send('Webhook received');
};
