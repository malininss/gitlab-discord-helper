import { WebhookEventType } from './enums';

export interface BodyWithType {
  eventType: WebhookEventType;
}
