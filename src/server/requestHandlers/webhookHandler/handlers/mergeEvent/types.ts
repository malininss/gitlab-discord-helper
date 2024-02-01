import { z } from 'zod';
import { schema } from './schema';

export type MergeEventPayload = z.infer<typeof schema>;
