import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

import { ProcessStageHistoryCreateDto } from '../../../application/dtos/process-stage-history.dto';
import { CreateProcessStageHistoryUseCase } from '../../../application/use-cases/create-process-stage-history';
import { ProcessStageChangedEvent } from 'src/contexts/rac/process/domain/events/process-stage-changed.event';

@Controller()
export class ProcessStageHistoryHandler {
  constructor(private readonly createProcessStageHistoryUseCase: CreateProcessStageHistoryUseCase) {}
  @EventPattern('process.stage.changed')
  handle(@Payload() message: ProcessStageChangedEvent, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.createProcessStageHistoryUseCase.execute(message.attributes as ProcessStageHistoryCreateDto);
      channel.ack(originalMsg);
      console.log('Executed use case', message);
    } catch (error) {
      console.error('Error processing message', error);
      channel.ack(originalMsg);
      return;
    }
  }
}
