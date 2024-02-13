import { z } from 'zod';
import type { approvalRulesSchema } from './schema.ts';

export type GetApprovalRulesPayload = z.infer<typeof approvalRulesSchema>;
