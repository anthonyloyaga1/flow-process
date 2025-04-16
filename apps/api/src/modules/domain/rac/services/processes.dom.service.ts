import { HttpException, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';
import { Paginated, PaginateQuery } from 'nestjs-paginate';

import { Constantes } from '../../../../shared/constants/constantes';
import { CurStatusEnum } from '../../../../shared/constants/cur-status.enum';
import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { StageProcessesEnum, StageProcessesMessages, StatusProcessesEnum, StatusProcessMessages } from '../../../../shared/constants/processes';
import { ProcessesRepository } from '../../../infraestructure/database/repositories/processes.repository';
import { entityHasDifferences, updateData } from '../../common/helpers/handler-changes-objects';
import { StageProcess } from '../../common/models/stage-process';
import { Process } from '../models/process';

dayjs.extend(isBetween);

@Injectable()
export class ProcessesDomService {
  constructor(private readonly processesRepository: ProcessesRepository) {}

  async create(body: Process): Promise<Process> {
    // RI001. Crear siempre en etapa recepción documental
    body.currentStageId = StageProcessesEnum.RECEPCION_DOCUMENTAL;
    body.currentStageDate = new Date();
    body.statusId = StatusProcessesEnum.GUARDADO_BORRADOR;
    const processSaved = await this.processesRepository.insert(body);
    return this.processesRepository.findOneBasicById(processSaved.id);
  }

  async findCollection(query: PaginateQuery): Promise<Paginated<Process>> {
    return await this.processesRepository.findCollection(query);
  }

  async findOneById(id: number): Promise<Process> {
    const process = await this.processesRepository.findOneById(id);
    if (!process) throw new HttpException(ErrorMessage.PROCESS_NOT_FOUND.MSG, ErrorMessage.PROCESS_NOT_FOUND.CODE);
    return process;
  }

  async findOneByIdSelectable(id: number, select?: string): Promise<Process> {
    const process = await this.processesRepository.findOneByIdSelectable(id, select);
    if (!process) throw new HttpException(ErrorMessage.PROCESS_NOT_FOUND.MSG, ErrorMessage.PROCESS_NOT_FOUND.CODE);
    return process;
  }

  async update(body: Process): Promise<Process> {
    const process = await this.processesRepository.findOneBasicById(body.id);

    this.checkProcessExists(process);
    this.checkSecondReceptionDate(process, body);
    if (!entityHasDifferences(body, process)) return process;

    const updatedProcess = updateData(body, process);
    await this.processesRepository.update(updatedProcess);
    return updatedProcess;
  }

  async softRemove(id: number, modifiedBy: string): Promise<string> {
    const process = await this.processesRepository.findOneBasicById(id);
    if (!process) throw new HttpException(ErrorMessage.PROCESS_NOT_FOUND.MSG, ErrorMessage.PROCESS_NOT_FOUND.CODE);

    const updatedProcess: Process = { ...process, active: false, modifiedAt: new Date(), modifiedBy };

    await this.processesRepository.update(updatedProcess);
    return Constantes.MSG_DELETED_OK;
  }

  async sendNextStage(id: number, modifiedBy: string): Promise<Process> {
    const currentProcess = await this.processesRepository.findOneById(id);
    if (!currentProcess) throw new HttpException(ErrorMessage.PROCESS_NOT_FOUND.MSG, ErrorMessage.PROCESS_NOT_FOUND.CODE);

    const { currentStage } = currentProcess;
    if (!currentStage.nextStageId) throw new HttpException(ErrorMessage.PROCESS_NOT_NEXT_STAGE.MSG, ErrorMessage.PROCESS_NOT_NEXT_STAGE.CODE);

    this.existDataInCurrentStage(currentProcess);
    this.checkProcessIsPendingApproval(currentProcess);

    this.checkPaidCurReviewStatus(currentProcess);

    const now = new Date();
    const updatedProcess: Partial<Process> = {
      id: currentProcess.id,
      modifiedAt: now,
      modifiedBy,
      statusId: this.getStatusFromStage(currentStage),
      currentStageId: currentStage.nextStageId,
      currentStageDate: now,
      returnStageId: null,
      returnStageDate: null,
      returnStageReason: null,
      returnStageByName: null,
      returnStageBy: null,
      returnApprovalRejectionReason: null,
    };
    await this.processesRepository.update(updatedProcess);
    return Object.assign(currentProcess, updatedProcess);
  }

  async sendToPreviousStage(body: Process): Promise<Process> {
    //* CU003_SF01. Retornar un trámite
    const currentProcess = await this.processesRepository.findOneById(body.id);
    if (!currentProcess) throw new HttpException(ErrorMessage.PROCESS_NOT_FOUND.MSG, ErrorMessage.PROCESS_NOT_FOUND.CODE);

    //* Validaciones internas
    this.checkStageDifference(currentProcess, body);
    this.checkReturnStageAllowed(currentProcess, body);
    this.checkProcessUnderReviewAndRejected(currentProcess, body);

    const updatedProcess: Partial<Process> = {
      id: body.id,
      returnStageId: body.returnStageId,
      returnStageReason: body.returnStageReason,
      returnStageByName: body.returnStageByName,
      returnStageBy: body.returnStageBy,
      statusId: StatusProcessesEnum.PENDIENTE_APROBACION_RETORNO,
      modifiedAt: new Date(),
      modifiedBy: body.modifiedBy,
      returnStageDate: new Date(),
      rejected: body.rejected,
    };
    await this.processesRepository.update(updatedProcess);

    return Object.assign(currentProcess, updatedProcess);
  }

  private existDataInCurrentStage(currentProcess: Process) {
    const { documentaryReview, medicalControl, tariffControl, budgetShipment, curReview, paymentShipment, currentStageId } = currentProcess;

    const stageConditions = {
      [StageProcessesEnum.RECEPCION_DOCUMENTAL]: true,
      [StageProcessesEnum.REVISION_DOCUMENTAL]: documentaryReview,
      [StageProcessesEnum.CONTROL_TECNICO_MEDICO]: medicalControl,
      [StageProcessesEnum.REVISION_TARIFAS]: tariffControl,
      [StageProcessesEnum.ENVIO_A_PRESUPUESTO]: budgetShipment,
      [StageProcessesEnum.ENVIO_A_PAGO]: paymentShipment,
      [StageProcessesEnum.CUR_POR_DISPARAR]: curReview,
    };

    if (stageConditions[currentStageId]) return;

    throw new HttpException(
      `${ErrorMessage.PROCESS_NOT_ALLOWED_CHANGE_STAGE.MSG} ${StageProcessesMessages[currentStageId]}`,
      ErrorMessage.PROCESS_NOT_ALLOWED_CHANGE_STAGE.CODE,
    );
  }

  private checkStageDifference(currentProcess: Process, body: Process) {
    if (currentProcess.currentStageId === body.returnStageId)
      throw new HttpException(ErrorMessage.PROCESS_SAME_STAGE.MSG, ErrorMessage.PROCESS_SAME_STAGE.CODE);
  }

  private checkReturnStageAllowed(currentProcess: Process, body: Process) {
    const isReturnToPreviousStageAllowed = currentProcess.currentStage.allowedReturnStage?.includes(body.returnStageId);
    if (!isReturnToPreviousStageAllowed)
      throw new HttpException(ErrorMessage.PROCESS_NOT_ALLOWED_RETURN_STAGE.MSG, ErrorMessage.PROCESS_NOT_ALLOWED_RETURN_STAGE.CODE);
  }

  private checkProcessUnderReviewAndRejected(currentProcess: Process, body: Process) {
    const sentToDocumentaryReception = body.returnStageId === StageProcessesEnum.RECEPCION_DOCUMENTAL;
    if (sentToDocumentaryReception && currentProcess.rejected)
      throw new HttpException(ErrorMessage.PROCESS_ALREADY_REJECTED.MSG, ErrorMessage.PROCESS_ALREADY_REJECTED.CODE);
  }

  private checkProcessExists(process: Process) {
    if (!process) throw new HttpException(ErrorMessage.PROCESS_NOT_FOUND.MSG, ErrorMessage.PROCESS_NOT_FOUND.CODE);
  }

  //* CU0002_SF01.5.2.1.2.1.1 Fecha de segunda recepción (Obligatorio): Este campo se habilita sólo para los
  // trámites en estado “Recepción Documental Retorno” y el Nro. de trámite tenga “-
  // R” Formato dd-mm-aaaa. La fecha de segunda recepción debe estar dentro del
  // mes siguiente del campo Fecha de recepción documental.
  private checkSecondReceptionDate(currentProcess: Process, body: Process) {
    if (currentProcess.rejected && !body.secondReceptionDate) {
      throw new HttpException(ErrorMessage.PROCESS_SECOND_RECEPTION_DATE_REQUIRED.MSG, ErrorMessage.PROCESS_SECOND_RECEPTION_DATE_REQUIRED.CODE);
    }
    if (currentProcess.rejected && body.secondReceptionDate) {
      const receptionDate = dayjs(currentProcess.receptionDate);
      const secondReceptionDate = dayjs(body.secondReceptionDate);

      const firstDayOfNextMonth = receptionDate.add(1, 'month').startOf('month');
      const lastDayOfNextMonth = receptionDate.add(1, 'month').endOf('month');

      if (!secondReceptionDate.isBetween(firstDayOfNextMonth, lastDayOfNextMonth, 'days', '[]')) {
        throw new HttpException(
          `${ErrorMessage.PROCESS_SECOND_RECEPTION_DATE_INVALID.MSG}. El campo secondReceptionDate '${dayjs(body.secondReceptionDate).format('YYYY-MM-DD')}' debe estar entre '${dayjs(firstDayOfNextMonth).add(1, 'day').format('YYYY-MM-DD')}' y '${dayjs(lastDayOfNextMonth).add(1, 'month').format('YYYY-MM-DD')}'`,
          ErrorMessage.PROCESS_SECOND_RECEPTION_DATE_INVALID.CODE,
        );
      }
    }
  }

  private checkProcessIsPendingApproval(process: Process) {
    if (process.statusId === StatusProcessesEnum.PENDIENTE_APROBACION_RETORNO) {
      throw new HttpException(
        ErrorMessage.PROCESS_NOT_ALLOWED_APPROVE_RETURN.MSG + StatusProcessMessages[process.statusId],
        ErrorMessage.PROCESS_NOT_ALLOWED_APPROVE_RETURN.CODE,
      );
    }
  }

  private getStatusFromStage(currentStage: StageProcess): number {
    return currentStage.nextStageId === StageProcessesEnum.FINALIZADO ? StatusProcessesEnum.FINALIZADO : StatusProcessesEnum.PENDIENTE_REVISION;
  }

  //* CU008.FB6.1.1.4: Verificar que esté en estado de pago para el registro de decha
  private checkPaidCurReviewStatus({ currentStageId, curReview }: Process) {
    const { statusCurId } = curReview || {};
    if (currentStageId === StageProcessesEnum.CUR_POR_DISPARAR && statusCurId && statusCurId !== CurStatusEnum.PAID) {
      throw new HttpException(ErrorMessage.PROCESS_CUR_REV_NOT_IN_PAYMENT_STATUS.MSG, ErrorMessage.PROCESS_CUR_REV_NOT_IN_PAYMENT_STATUS.CODE);
    }
  }
}
