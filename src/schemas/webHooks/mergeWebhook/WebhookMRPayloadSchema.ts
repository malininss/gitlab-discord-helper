import { z } from 'zod';
import { MergeWebhookActions } from './enums';
import { WebhookEventType } from '../enums';

export const MergeWebhookPayloadSchema = z.object({
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
    action: z.optional(z.nativeEnum(MergeWebhookActions)),
    draft: z.boolean(),
  }),
  changes: z.optional(
    z.object({
      draft: z.optional(
        z.object({
          previous: z.boolean(),
          current: z.boolean(),
        })
      ),
    })
  ),
});
