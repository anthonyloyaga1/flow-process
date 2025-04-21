import { EVENT_BUS, EventBus } from '@common/domain/event-bus';
import { Inject, Injectable } from '@nestjs/common';

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
    @Inject(EVENT_BUS) private readonly eventBus: EventBus,
    private readonly stageFinder: StageFinder,
    private readonly processFinder: ProcessFinder,
  ) {}

  //? No borrar porque se está probando sin el agregate root propio
  // async execute(processId: string, returnStageId: string): Promise<ProcessReadDto> {
  //   const process = this.publisher.mergeObjectContext(await this.processFinder.findById(processId));
  //   const returnStage = await this.stageFinder.findById(returnStageId);
  //   const currentStage = await this.stageFinder.findById(process.currentStageId);

  //   ProcessActions.returnToPreviousStage(process, currentStage, returnStage);

  //   await this.processRepository.update(processId, process);

  //   process.commit();
  //   return ProcessFactory.toPublic(process);
  // }

  async execute(processId: string, returnStageId: string): Promise<ProcessReadDto> {
    const process = await this.processFinder.findById(processId);
    const returnStage = await this.stageFinder.findById(returnStageId);
    const currentStage = await this.stageFinder.findById(process.currentStageId);

    ProcessActions.returnToPreviousStage(process, currentStage, returnStage);
    await this.processRepository.update(processId, process);

    this.eventBus.publishAll(process.pullEvents());

    return ProcessFactory.toPublic(process);
  }
}
