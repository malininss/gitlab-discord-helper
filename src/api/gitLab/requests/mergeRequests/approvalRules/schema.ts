import { z } from 'zod';
import { ApprovalRuleType } from './enums';

export const approvalRulesSchema = z.array(
  z.object({
    ruleType: z.nativeEnum(ApprovalRuleType),
    groups: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
      })
    ),
  })
);
