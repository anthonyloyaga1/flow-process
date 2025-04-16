import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ProcessCreatedEvent } from '../../../domain/events/process-created.event';
import { PROCESS_REPOSITORY, ProcessRepository } from '../../../domain/repositories/process.repository';

@EventsHandler(ProcessCreatedEvent)
export class ProcessCreatedHandler implements IEventHandler<ProcessCreatedEvent> {
  constructor(@Inject(PROCESS_REPOSITORY) private readonly processRepository: ProcessRepository) {}

  handle(event: ProcessCreatedEvent) {
    console.log('ProcessCreatedEvent:', event);
  }
}
