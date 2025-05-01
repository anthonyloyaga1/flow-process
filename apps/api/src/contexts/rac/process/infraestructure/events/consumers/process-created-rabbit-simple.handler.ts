import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';

@Controller()
export class ProcessCreatedRabbitSimpleHandler {
  @EventPattern('process.created')
  getNotifications(@Payload() message: any, @Ctx() context: RmqContext) {
    console.log('ProcessCreatedHandlerRabbit', message);
    const channel = context.getChannelRef() as Channel;
    const originalMsg = context.getMessage() as Message;

    if (this.hasError()) {
      channel.reject(originalMsg, false);
      return;
    }

    channel.ack(originalMsg);
  }

  private hasError(): boolean {
    return true;
  }
}
