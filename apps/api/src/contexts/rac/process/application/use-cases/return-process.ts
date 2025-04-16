import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { ProcessActions } from '../../domain/entities/process-actions';
import { ProcessFactory } from '../../domain/entities/process-factory';
import { PROCESS_REPOSITORY, ProcessRepository } from '../../domain/repositories/process.repository';
import { ProcessReadDto } from '../dtos/process.dto';
import { ProcessFinder } from '../services/process-finder.service';
import { StageFinder } from '../services/stage-finder.service';

@Injectable()
export class ReturnProcessStage {
  constructor(
    @Inject(PROCESS_REPOSITORY) private readonly processRepository: ProcessRepository,
    private readonly stageFinder: StageFinder,
    private readonly processFinder: ProcessFinder,
    private publisher: EventPublisher,
  ) {}

  async execute(processId: string, returnStageId: string): Promise<ProcessReadDto> {
    const process = this.publisher.mergeObjectContext(await this.processFinder.findById(processId));
    const returnStage = await this.stageFinder.findById(returnStageId);
    const currentStage = await this.stageFinder.findById(process.currentStageId);

    ProcessActions.returnToPreviousStage(process, currentStage, returnStage);

    await this.processRepository.update(processId, process);

    process.commit();
    return ProcessFactory.toPublic(process);
  }
}
