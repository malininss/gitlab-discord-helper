import { z } from 'zod';
import { MRAction } from './enums.js';
import { WebhookEventType } from '../enums.js';

export const WebhookMRPayloadSchema = z.object({
  eventType: z.nativeEnum(WebhookEventType),
  project: z.object({
    id: z.number(),
  }),
  user: z.object({
    name: z.string(),
  }),
  objectAttributes: z.object({
    iid: z.number(),
    url: z.string(),
    title: z.string(),
    action: z.optional(z.nativeEnum(MRAction)),
  }),
});
