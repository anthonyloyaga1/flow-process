import { DomainEvent } from '@common/domain/domain-event';
import { EventBus } from '@common/domain/event-bus';
import { Injectable } from '@nestjs/common';
import { AmqpMessageBus, MessageBus, RoutingMessage } from '@nestjstools/microservices-rabbitmq';

@Injectable()
export class RabbitEventBus implements EventBus {
  constructor(@MessageBus('event.bus') private readonly eventBus: AmqpMessageBus) {}

  async publish(event: DomainEvent): Promise<void> {
    this.eventBus.dispatch(new RoutingMessage(event, event.eventName));
  }

  async publishAll(events: Array<DomainEvent>): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}
