import { Inject, Injectable } from '@nestjs/common';

import { Stage } from '../../domain/entities/stage.model';
import { STAGE_REPOSITORY, StageRepository } from '../../domain/repositories/stage.repository';

@Injectable()
export class StageFinder {
  constructor(@Inject(STAGE_REPOSITORY) private readonly stageRepository: StageRepository) {}

  async findById(id: string): Promise<Stage> {
    return this.stageRepository.findById(id);
  }

  async findAll(): Promise<Stage[]> {
    return this.stageRepository.findAll();
  }
}
