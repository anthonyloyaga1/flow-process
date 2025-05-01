import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { ProcessActions } from '../../domain/entities/process-actions';
import { ProcessFactory } from '../../domain/entities/process-factory';
import { PROCESS_REPOSITORY, ProcessRepository } from '../../domain/repositories/process.repository';
import { ProcessReadDto } from '../dtos/process.dto';
import { ProcessFinder } from '../services/process-finder.service';
import { StageFinder } from '../services/stage-finder.service';

@Injectable()
export class AdvanceProcessStage {
  constructor(
    @Inject(PROCESS_REPOSITORY) private readonly processRepository: ProcessRepository,
    // @Inject(EVENT_BUS) private readonly eventBus: EventBus,
    private readonly stageFinder: StageFinder,
    private readonly processFinder: ProcessFinder,
    @Inject('event.bus.client') private readonly eventBus: ClientProxy,
  ) {}

  //? No borrar porque se está probando sin el agregate root propio
  // async execute(processId: string): Promise<ProcessReadDto> {
  //   const process = this.publisher.mergeObjectContext(await this.processFinder.findById(processId));
  //   const nextStage = await this.stageFinder.findById(process.currentStageId);

  //   ProcessActions.advanceToNextStage(process, nextStage);
  //   await this.processRepository.update(processId, process);

  //   process.commit();

  //   return ProcessFactory.toPublic(process);
  // }

  async execute(processId: string): Promise<ProcessReadDto> {
    const process = await this.processFinder.findById(processId);
    const nextStage = await this.stageFinder.findById(process.currentStageId);

    ProcessActions.advanceToNextStage(process, nextStage);
    await this.processRepository.update(processId, process);

    // await this.eventBus.publish(process.pullEvents()[0]);
    // await this.processRepository.update(processId, process);

    const event = process.pullEvents()[0];

    // this.eventBus.status.subscribe({
    //   next: (status) => {
    //     console.log('Event bus status:', status);
    //   },
    //   error: (error) => {
    //     console.error('Event bus error:', error);
    //   },
    // });

    try {
      const sended = await firstValueFrom(this.eventBus.emit(event.eventName, event));
      console.log('Event sent:', sended);
    } catch {
      console.error('Error publishing event:');
      throw new InternalServerErrorException('Error publishing event to event bus');
    }

    return ProcessFactory.toPublic(process);
  }
}
