import type { Request, Response } from 'express';
import { transformKeysToCamelCase } from 'utils/transformKeysToCamelCase';
import { handleByEvenType } from './helpers/handleByEvenType';

export const webhookHandler = (req: Request, res: Response): void => {
  const body = transformKeysToCamelCase(req.body);
  handleByEvenType(body)?.catch(console.error);

  res.status(200).send('Webhook received');
};
