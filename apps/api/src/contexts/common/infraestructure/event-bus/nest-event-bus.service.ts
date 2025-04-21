import { DomainEvent } from '@common/domain/domain-event';
import { EventBus } from '@common/domain/event-bus';
import { Injectable } from '@nestjs/common';
import { EventBus as NestCqrsEventBus } from '@nestjs/cqrs';

@Injectable()
export class NestEventBus implements EventBus {
  constructor(private readonly nestEventBus: NestCqrsEventBus) {}

  async publish(event: DomainEvent): Promise<void> {
    await this.nestEventBus.publish(event);
  }

  async publishAll(events: Array<DomainEvent>): Promise<void> {
    await this.nestEventBus.publishAll(events);
  }
}
