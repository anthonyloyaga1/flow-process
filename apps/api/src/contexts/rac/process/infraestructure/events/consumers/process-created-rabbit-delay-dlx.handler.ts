import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { AmqpMessageBus, MessageBus, RoutingMessage } from '@nestjstools/microservices-rabbitmq';
import { Channel, Message } from 'amqplib';

@Controller()
export class ProcessCreatedDelayDlxHandler {
  constructor(@MessageBus('flow_process.dlx') private readonly eventBus: AmqpMessageBus) {}

  @EventPattern('process.created')
  getNotifications(@Payload() message: any, @Ctx() context: RmqContext) {
    console.log('ProcessCreatedHandlerRabbit', message);
    const channel = context.getChannelRef() as Channel;
    const originalMsg = context.getMessage() as Message;

    if (this.hasError()) {
      channel.ack(originalMsg);

      const baseDelay = 1000;
      const headerDelay = originalMsg.properties.headers['x-delay'];
      const headerDeathCount = originalMsg.properties.headers['x-death'];

      const deathCount = headerDeathCount ? headerDeathCount[0].count : 0;
      const delay = headerDelay ? -1 * parseInt(headerDelay.toString()) : baseDelay;
      const newDelay = delay + baseDelay * deathCount;

      this.eventBus.dispatch(new RoutingMessage(message, 'process.retry', undefined, { 'x-delay': newDelay + '' }));
    }
  }

  private hasError(): boolean {
    return true;
  }
}
