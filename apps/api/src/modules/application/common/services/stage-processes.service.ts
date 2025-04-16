import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { StageProcessesDomService } from '../../../domain/common/services/stage_processes.dom.service';
import { StageProcessDto } from '../dto/stage-process.dto';

@Injectable()
export class StageProcessesService {
  constructor(private readonly stageProcessesDomService: StageProcessesDomService) {}

  async findOneById(id: number) {
    const stageProcess = this.stageProcessesDomService.findOneById(id);
    return plainToInstance(StageProcessDto, stageProcess, { excludeExtraneousValues: true });
  }

  async findList() {
    const entities = await this.stageProcessesDomService.findList();
    return plainToInstance(StageProcessDto, entities, { strategy: 'excludeAll' });
  }
}
