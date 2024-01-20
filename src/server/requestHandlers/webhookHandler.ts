import { Request, Response } from 'express';
import { createMRTread } from '../../discordClient/actions/createMRTread.js';
import { transformKeysToCamelCase } from '../../utils/toCamelCase.js';
import { WebhookMRPayloadSchema } from '../../schemas/webHooks/MRWebhook/WebhookMRPayloadSchema.js';
import { WebhookEventType } from '../../schemas/webHooks/enums.js';
import { MRAction } from '../../schemas/webHooks/MRWebhook/enums.js';

export const webhookHandler = async (req: Request, res: Response) => {
  const body = transformKeysToCamelCase(req.body);

  if (body.eventType !== WebhookEventType.MergeRequest) {
    return;
  }

  const MRInfo = WebhookMRPayloadSchema.parse(body);
  /**
   * in test trigger there is no MRInfo.objectAttributes.action
   * TODO: remove condition !MRInfo.objectAttributes.action before release
   */
  if (
    !MRInfo.objectAttributes.action ||
    MRInfo.objectAttributes.action === MRAction.Open
  ) {
    createMRTread(MRInfo);
  }

  res.status(200).send('Webhook received');
};
