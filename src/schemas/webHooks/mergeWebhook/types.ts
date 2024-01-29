import { z } from 'zod';
import { MergeWebhookPayloadSchema } from './WebhookMRPayloadSchema';

export type MergeWebhookPayload = z.infer<typeof MergeWebhookPayloadSchema>;
