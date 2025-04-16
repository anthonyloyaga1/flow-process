import { v4 as uuidv4 } from 'uuid';

export abstract class DomainEvent {
  static EVENT_NAME: string;

  readonly aggregateId: string;
  readonly eventId: string;
  readonly occurredOn: Date;
  readonly eventName: string;
  readonly attributes: Record<string, any>;

  constructor(params: { eventName: string; aggregateId: string; eventId?: string; occurredOn?: Date; attributes?: Record<string, any> }) {
    this.aggregateId = params.aggregateId;
    this.eventId = params.eventId || uuidv4();
    this.occurredOn = params.occurredOn || new Date();
    this.eventName = params.eventName;
    this.attributes = params.attributes || {};
  }
}
