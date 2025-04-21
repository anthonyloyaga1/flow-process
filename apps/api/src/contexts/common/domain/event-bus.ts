import { DomainEvent } from './domain-event';

export interface EventBus {
  publish(event: DomainEvent): Promise<void>;
  publishAll(events: Array<DomainEvent>): Promise<void>;
}

export const EVENT_BUS = Symbol('EVENT_BUS');
