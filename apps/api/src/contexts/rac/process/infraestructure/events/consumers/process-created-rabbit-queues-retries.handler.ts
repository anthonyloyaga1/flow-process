import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';

@Controller() //map your routingKey or messageRoute
export class ProcessCreatedQueuesRetriesHandler {
  constructor(
    @Inject('PROCESS_RETRY_5S') private client_5s: ClientProxy,
    @Inject('PROCESS_RETRY_10S') private client_10s: ClientProxy,
  ) {}
  @EventPattern('process.created')
  getNotifications(@Payload() message: any, @Ctx() context: RmqContext) {
    console.log('ProcessCreatedHandlerRabbit', message);
    const channel = context.getChannelRef() as Channel;
    const originalMsg = context.getMessage() as Message;

    if (this.hasError(message)) {
      console.log('Error in message', message);
      channel.ack(originalMsg); // Para que no se vuelva a procesar el mensaje con el dead-letter de main.ts

      const headerDeathCount = originalMsg.properties.headers['x-death'];
      const deathCount = headerDeathCount ? headerDeathCount[0].count : 0; // Si no tiene el header, le asigna 0

      if (deathCount < 1) {
        this.client_5s.emit('process.created', message);
        return;
      }
      this.client_10s.emit('process.created', message);
    }
  }

  private hasError(message: any): boolean {
    return !!message;
  }
}
