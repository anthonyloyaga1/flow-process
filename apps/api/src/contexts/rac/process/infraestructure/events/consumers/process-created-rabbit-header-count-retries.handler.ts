import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { AmqpMessageBus, MessageBus, RoutingMessage } from '@nestjstools/microservices-rabbitmq';
import { Channel, Message } from 'amqplib';

@Controller()
export class ProcessCreatedDelayHeaderCountRetriesHandler {
  constructor(@MessageBus('flow_process.dlx') private readonly eventBus: AmqpMessageBus) {}

  @EventPattern('process.created')
  getNotifications(@Payload() message: any, @Ctx() context: RmqContext) {
    console.log('ProcessCreatedHandlerRabbit', message);
    const channel = context.getChannelRef() as Channel;
    const originalMsg = context.getMessage() as Message;

    if (this.hasError()) {
      const headerDeathCount = originalMsg.properties.headers['x-death'];
      const deathCount = headerDeathCount ? headerDeathCount[0].count : 0; // Si no tiene el header, le asigna 0
      if (deathCount < 3) {
        channel.reject(originalMsg, false); // Rechaza el mensaje para que se envíe al dead-letter de main.ts
      } else {
        channel.ack(originalMsg); // Para que no se vuelva a procesar el mensaje con el dead-letter de main.ts
        this.eventBus.dispatch(new RoutingMessage(message, 'process.dlq'));
      }
    }
  }

  private hasError(): boolean {
    return true;
  }
}
