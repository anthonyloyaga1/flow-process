import { HttpException, Injectable } from '@nestjs/common';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { StatusProcessesEnum, StatusProcessMessages } from '../../../../shared/constants/processes';
import { ProcessesRepository } from '../../../infraestructure/database/repositories/processes.repository';
import { Process } from '../models/process';

@Injectable()
export class ManageReturnsDomService {
  constructor(private readonly processesRepository: ProcessesRepository) {}

  async manageProcessReturn(id: number, body: Partial<Process>): Promise<Process> {
    const currentProcess = await this.processesRepository.findOneBasicById(id);
    if (!currentProcess) throw new HttpException(ErrorMessage.PROCESS_NOT_FOUND.MSG, ErrorMessage.PROCESS_NOT_FOUND.CODE);

    this.checkProcessStatusBeforeReturn(currentProcess);

    if (body.statusId === StatusProcessesEnum.APROBADO_RETORNO) return this.approveReturnToPreviousStage(currentProcess, body);

    return this.rejectReturnToPreviousStage(currentProcess, body.modifiedBy);
  }

  private async approveReturnToPreviousStage(currentProcess: Process, body: Partial<Process>): Promise<Process> {
    const updatedProcess: Partial<Process> = {
      id: currentProcess.id,
      caseNumber: this.appendReturnSuffix(currentProcess),
      currentStageId: currentProcess.returnStageId,
      statusId: StatusProcessesEnum.APROBADO_RETORNO,
      modifiedAt: new Date(),
      modifiedBy: body.modifiedBy,
    };
    await this.processesRepository.update(updatedProcess);
    return Object.assign(currentProcess, updatedProcess);
  }

  private async rejectReturnToPreviousStage(currentProcess: Process, modifiedBy: string): Promise<Process> {
    const updatedProcess: Partial<Process> = {
      id: currentProcess.id,
      statusId: StatusProcessesEnum.RECHAZADO_RETORNO,
      returnApprovalRejectionReason: currentProcess.returnApprovalRejectionReason,
      modifiedAt: new Date(),
      rejected: this.isReturnCaseValid(currentProcess),
      modifiedBy,
    };
    await this.processesRepository.update(updatedProcess);
    return Object.assign(currentProcess, updatedProcess);
  }

  private isReturnCaseValid(currentProcess: Process): boolean {
    return !currentProcess.caseNumber.endsWith('-R') ? null : currentProcess.rejected;
  }

  private appendReturnSuffix(currentProcess: Process): string {
    if (currentProcess.rejected && !currentProcess.caseNumber.endsWith('-R')) return currentProcess.caseNumber + '-R';
    return currentProcess.caseNumber;
  }

  private checkProcessStatusBeforeReturn(currentProcess: Process) {
    if (currentProcess.statusId !== StatusProcessesEnum.PENDIENTE_APROBACION_RETORNO) {
      throw new HttpException(
        ErrorMessage.PROCESS_NOT_ALLOWED_APPROVE_RETURN.MSG + StatusProcessMessages[currentProcess.statusId],
        ErrorMessage.PROCESS_NOT_ALLOWED_APPROVE_RETURN.CODE,
      );
    }
  }
}
