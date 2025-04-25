import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, Ctx, EventPattern, Payload, RmqContext, RmqRecordBuilder } from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';

@Controller() //map your routingKey or messageRoute
export class ProcessCreatedHandlerRabbit {
  constructor(
    @Inject('PROCESS_RETRY_5S') private client: ClientProxy,
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

      const headerDelay = originalMsg.properties.headers['x-delay'];

      const delay = headerDelay ? parseInt(headerDelay.toString()) + 5000 : 5000; // Si no tiene el header, le asigna 5s

      if (delay == 5000) {
        const record = new RmqRecordBuilder(message).setOptions({ headers: { ['x-delay']: delay + '' } }).build();
        this.client.emit('process.created', record); // Emitir el mensaje al exchange de retry
      }
      if (delay >= 10000) {
        const record = new RmqRecordBuilder(message).setOptions({ headers: { ['x-delay']: +delay + '' } }).build();
        this.client_10s.emit('process.created', record); // Emitir el mensaje al exchange de retry
      }
    }
  }

  private hasError(message: any): boolean {
    return !!message;
  }
}
