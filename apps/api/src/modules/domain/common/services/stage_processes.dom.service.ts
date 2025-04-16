import { HttpException, Injectable } from '@nestjs/common';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { StageProcessesRepository } from '../../../infraestructure/database/repositories/stage-processes.repository';
import { StageProcess } from '../models/stage-process';

@Injectable()
export class StageProcessesDomService {
  constructor(private readonly stageProcessesRepository: StageProcessesRepository) {}

  async findOneById(id: number) {
    const stageProcess = await this.stageProcessesRepository.findOneBasicById(id);
    this.checkStageProcessExist(stageProcess);

    return stageProcess;
  }

  async findList() {
    const stageProcesses = await this.stageProcessesRepository.findList();
    this.checkStageProcessesExist(stageProcesses);

    return stageProcesses;
  }

  private checkStageProcessesExist(stageProcesses: StageProcess[]) {
    if (!stageProcesses) throw new HttpException(ErrorMessage.STATUS_PROCESS_NOT_FOUND.MSG, ErrorMessage.STATUS_PROCESS_NOT_FOUND.CODE);
  }

  private checkStageProcessExist(stageProcess: StageProcess) {
    if (!stageProcess) throw new HttpException(ErrorMessage.STATUS_PROCESS_NOT_FOUND.MSG, ErrorMessage.STATUS_PROCESS_NOT_FOUND.CODE);
  }
}
