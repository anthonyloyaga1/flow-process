import { Inject, Injectable } from '@nestjs/common';
import { EventBus, EventPublisher } from '@nestjs/cqrs';

import { ProviderFinder } from '../../../provider/application/services/provider-finder.service';
import { ProcessFactory } from '../../domain/entities/process-factory';
import { PROCESS_REPOSITORY, ProcessRepository } from '../../domain/repositories/process.repository';
import { ProcessCreateDto, ProcessReadDto } from '../dtos/process.dto';

@Injectable()
export class CreateProcess {
  constructor(
    @Inject(PROCESS_REPOSITORY) private readonly processRepository: ProcessRepository,
    private readonly providerFinder: ProviderFinder,
    private readonly eventBus: EventBus,
    private publisher: EventPublisher,
  ) {}

  async execute(input: ProcessCreateDto): Promise<ProcessReadDto> {
    await this.providerFinder.findProvider(input.providerId);

    // const process = this.publisher.mergeObjectContext(ProcessFactory.create(input));
    const process = ProcessFactory.create(input);
    // const event = process.getUncommittedEvents()[0];
    // this.eventBus.publish(event);

    await this.processRepository.save(process);
    this.eventBus.publishAll(process.getUncommittedEvents());
    process.commit();
    return ProcessFactory.toPublic(process);
  }
}
