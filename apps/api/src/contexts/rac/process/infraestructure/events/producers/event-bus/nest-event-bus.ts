import { DomainEvent } from '@common/domain/domain-event';
import { EventBus } from '@common/domain/event-bus';
import { Injectable } from '@nestjs/common';
import { EventBus as NestCqrsEventBusWrapper } from '@nestjs/cqrs';

@Injectable()
export class NestCqrsEventBus implements EventBus {
  constructor(private readonly eventBus: NestCqrsEventBusWrapper) {}

  async publish(event: DomainEvent): Promise<void> {
    await this.eventBus.publish(event);
  }

  async publishAll(events: Array<DomainEvent>): Promise<void> {
    await this.eventBus.publishAll(events);
  }
}
