import { z } from 'zod';
import { MergeWebhookPayloadSchema } from './WebhookMRPayloadSchema.js';

export type MergeWebhookPayload = z.infer<typeof MergeWebhookPayloadSchema>;
