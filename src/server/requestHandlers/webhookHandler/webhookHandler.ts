import type { Request, Response } from 'express';
import { transformKeysToCamelCase } from 'utils/transformKeysToCamelCase';
import { callActionByEventType } from './helpers/callActionByEventType';

export const webhookHandler = (req: Request, res: Response): void => {
  const body = transformKeysToCamelCase(req.body);
  callActionByEventType(body)?.catch(console.error);

  res.status(200).send('Webhook received');
};
