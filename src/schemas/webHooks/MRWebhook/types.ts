import { z } from 'zod';
import { WebhookMRPayloadSchema } from './WebhookMRPayloadSchema.js';

export type WebhookMRPayload = z.infer<typeof WebhookMRPayloadSchema>;
