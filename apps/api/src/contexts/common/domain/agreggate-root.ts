import { DomainEvent } from './domain-event';

export abstract class AggregateRoot {
  private events: DomainEvent[];

  constructor() {
    this.events = [];
  }

  apply(event: DomainEvent): void {
    this.events.push(event);
  }

  pullEvents(): DomainEvent[] {
    const events = this.events;
    this.events = [];
    return events;
  }

  uncommittedEvents(): DomainEvent[] {
    return this.events;
  }

  commit(): void {
    this.events = [];
  }
}
