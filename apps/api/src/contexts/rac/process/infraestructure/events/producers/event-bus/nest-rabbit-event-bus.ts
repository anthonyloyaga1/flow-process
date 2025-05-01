import { DomainEvent } from '@common/domain/domain-event';
import { EventBus } from '@common/domain/event-bus';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NestRabbitEventBus implements EventBus {
  constructor(@Inject('event.bus.client') private readonly eventBus: ClientProxy) {}

  async publish(event: DomainEvent): Promise<void> {
    try {
      this.eventBus.send(event.eventName, event);
      // console.log('Event sent:', sendedEvent);
    } catch (error) {
      console.error('Error publishing event:', error);
    }
  }

  async publishAll(events: Array<DomainEvent>): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}
