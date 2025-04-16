import { Inject, Injectable } from '@nestjs/common';

import { Stage } from '../../domain/entities/stage.model';
import { STAGE_REPOSITORY, StageRepository } from '../../domain/repositories/stage.repository';

@Injectable()
export class FindAllStages {
  constructor(@Inject(STAGE_REPOSITORY) private readonly stageRepository: StageRepository) {}

  async execute(): Promise<Stage[]> {
    return this.stageRepository.findAll();
  }
}
