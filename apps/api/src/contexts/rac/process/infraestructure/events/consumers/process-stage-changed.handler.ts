import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ProcessStageChangedEvent } from '../../../domain/events/process-stage-changed.event';
import { PROCESS_REPOSITORY, ProcessRepository } from '../../../domain/repositories/process.repository';

@EventsHandler(ProcessStageChangedEvent)
export class ProcessStageChangedHandler implements IEventHandler<ProcessStageChangedEvent> {
  constructor(@Inject(PROCESS_REPOSITORY) private readonly processRepository: ProcessRepository) {}

  handle(event: ProcessStageChangedEvent) {
    console.log('ProcessStageChangedEvent:', event);
  }
}
