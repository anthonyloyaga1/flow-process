import { HttpException, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import {
  DaysToActivateDelayReasonByStage,
  StageProcessesEnum,
  StageProcessesMessages,
  StatusProcessesEnum,
  StatusProcessMessages,
} from '../../../../shared/constants/processes';
import { ProcessesRepository } from '../../../infraestructure/database/repositories/processes.repository';
import { TariffControlsRepository } from '../../../infraestructure/database/repositories/tariff-controls.repository';
import { updateData } from '../../common/helpers/handler-changes-objects';
import { Process } from '../models/process';
import { TariffControl } from '../models/tariff-control';

dayjs.extend(isBetween);

@Injectable()
export class TariffControlsDomService {
  constructor(
    private readonly tariffControlsRepository: TariffControlsRepository,
    private readonly processRepository: ProcessesRepository,
  ) {}

  async create(body: TariffControl) {
    const process = await this.processRepository.findOneBasicById(body.processId);

    //* Validaciones internas
    this.checkProcessExists(process);
    this.checkProcessIsPendingApproval(process);
    this.checkProcessInTariffControlStage(process);
    await this.checkForExistingTariffControl(body);

    //* CU005.FB6.1.1.1: Validaciones flujo básico
    this.checkReviewDateRange(body, process);

    //* CU005.FB6.1.1.2: Validación de motivo de retraso (delayReason) requerido si la diferencia de días es mayor a 45 días (>=45)
    this.checkReviewDateDelay(body, process);

    //* CU005-FB6.1.2.1: Validación rango de fechas para fecha de entrega de expedientes
    this.checkFilesDeliveryDateRange(body, process);

    //* CU005.FB6.1.3.1: Validación rango de fechas para fecha de envío de la gestión documental
    this.checkDocumentManagementDateSendRange(body, process);

    //* Validaciones internas
    this.checkApprovedValue(body.approvedValue, process.requestedAmount);

    body.objectedValue = process.requestedAmount - body.approvedValue;
    body.currentStageStartDate = process.currentStageDate;
    const tariffControlSaved = await this.tariffControlsRepository.transactionTariffControlProcessStatus(body, StatusProcessesEnum.GUARDADO_BORRADOR);
    return tariffControlSaved;
  }

  async findOneById(id: number): Promise<TariffControl> {
    const tariffControl = await this.tariffControlsRepository.findOneBasicById(id);
    this.checkExistTariffControl(tariffControl);

    return tariffControl;
  }

  async findOneByProcessId(processId: number): Promise<TariffControl> {
    const tariffControl = await this.tariffControlsRepository.findOneByProcessId(processId);
    this.checkExistTariffControl(tariffControl);

    return tariffControl;
  }

  async update(body: TariffControl): Promise<TariffControl> {
    const tariffControl = await this.tariffControlsRepository.findOneBasicById(body.id);
    this.checkExistTariffControl(tariffControl);

    const process = await this.processRepository.findOneBasicById(tariffControl.processId);
    this.checkProcessInTariffControlStage(process);
    this.checkProcessIsPendingApproval(process);

    const updatedTariffControl = updateData(body, tariffControl);
    const tariffControlSaved = await this.tariffControlsRepository.transactionTariffControlProcessStatus(
      updatedTariffControl,
      StatusProcessesEnum.GUARDADO_BORRADOR,
    );
    return tariffControlSaved;
  }

  private checkExistTariffControl(tariffControl: TariffControl) {
    if (!tariffControl) throw new HttpException(ErrorMessage.DOC_REV_NOT_FOUND.MSG, ErrorMessage.DOC_REV_NOT_FOUND.CODE);
  }

  private checkProcessExists(process: Process) {
    if (!process) throw new HttpException(ErrorMessage.PROCESS_NOT_FOUND.MSG, ErrorMessage.PROCESS_NOT_FOUND.CODE);
  }

  private async checkForExistingTariffControl(body: TariffControl) {
    const tariffControlExist = await this.tariffControlsRepository.existTariffControlByProcessId(body.processId);
    if (tariffControlExist) throw new HttpException(ErrorMessage.TARIFF_CTRL_EXIST.MSG, ErrorMessage.TARIFF_CTRL_EXIST.CODE);
  }

  private checkProcessIsPendingApproval(process: Process) {
    if (process.statusId === StatusProcessesEnum.PENDIENTE_APROBACION_RETORNO) {
      throw new HttpException(
        ErrorMessage.PROCESS_NOT_ALLOWED_APPROVE_RETURN.MSG + StatusProcessMessages[process.statusId],
        ErrorMessage.PROCESS_NOT_ALLOWED_APPROVE_RETURN.CODE,
      );
    }
  }

  private checkProcessInTariffControlStage(process: Process) {
    if (process.currentStageId !== StageProcessesEnum.REVISION_TARIFAS) {
      throw new HttpException(
        ErrorMessage.PROCESS_NOT_IN_TARIFF_CTRL_STAGE.MSG + StageProcessesMessages[process.currentStageId],
        ErrorMessage.PROCESS_NOT_IN_TARIFF_CTRL_STAGE.CODE,
      );
    }
  }

  //* CU005 FB6.1.1.1: Valdiaciones de flujo básico
  // - Por defecto se coloca la fecha actual
  // - Permite seleccionar una fecha anterior hasta la fecha para la revisión CTM en la bandeja de Control Técnico Médico.
  // - Y no permite seleccionar un día después a la fecha actual

  private checkReviewDateRange({ liquidationStartDate }: TariffControl, { currentStageDate }: Process) {
    const startDateDayjs = dayjs(liquidationStartDate);
    const processStageDateDayjs = dayjs(currentStageDate);
    const currentDateDayjs = dayjs();

    if (!startDateDayjs.isBetween(processStageDateDayjs, currentDateDayjs, 'day', '[]'))
      throw new HttpException(
        `${ErrorMessage.TARIFF_CTRL_START_DATE_RELEVANCE.MSG}. El campo liquidationStartDate '${startDateDayjs.format('YYYY-MM-DD')}' debe estar entre '${processStageDateDayjs.format('YYYY-MM-DD')}' y '${currentDateDayjs.format('YYYY-MM-DD')}'`,
        ErrorMessage.TARIFF_CTRL_START_DATE_RELEVANCE.CODE,
      );
  }

  //* CU005.FB6.1.1.2: Validaciones de flujo básico
  // - Motivo de retraso de revisión (Obligatorio): Texto de 200 caracteres. Este campo
  // se habilita sólo si existe una diferencia de 45 días entre la fecha de inicio
  // con la fecha para la revisión CTM
  private checkReviewDateDelay({ liquidationStartDate }: TariffControl, { currentStageDate, currentStageId }: Process) {
    const startDateDayjs = dayjs(liquidationStartDate);
    const processStageDateDayjs = dayjs(currentStageDate);

    const dateDiff = startDateDayjs.diff(processStageDateDayjs, 'days');
    if (dateDiff >= DaysToActivateDelayReasonByStage[currentStageId]) {
      throw new HttpException(ErrorMessage.TARIFF_CTRL_DELAY_REASON_REQUIRED.MSG, ErrorMessage.TARIFF_CTRL_DELAY_REASON_REQUIRED.CODE);
    }
  }

  //* CU005-FB6-1-2-1: : Validaciones de flujo básico
  // ▪ Permita seleccionar una fecha anterior hasta la fecha para la revisión CTM en la bandeja de Control Técnico Médico.
  // ▪ Y no permita seleccionar fechas posteriores a la fecha actual
  private checkFilesDeliveryDateRange({ filesDeliveryDate }: TariffControl, { currentStageDate }: Process) {
    const currentDateDayjs = dayjs();
    const processStageDateDayjs = dayjs(currentStageDate);
    const filesDeliveryDateDayjs = dayjs(filesDeliveryDate);

    if (!filesDeliveryDateDayjs.isBetween(processStageDateDayjs, currentDateDayjs, 'days', '[]')) {
      throw new HttpException(
        `${ErrorMessage.TARIFF_CTRL_FILES_DELIVERY_DATE_INVALID.MSG}. El campo filesDeliveryDate '${filesDeliveryDateDayjs.format('YYYY-MM-DD')}' debe estar entre '${processStageDateDayjs.format('YYYY-MM-DD')}' y '${currentDateDayjs.format('YYYY-MM-DD')}'`,
        ErrorMessage.TARIFF_CTRL_FILES_DELIVERY_DATE_INVALID.CODE,
      );
    }
  }

  //* CU005-FB6-1-3-1: : Validaciones de flujo básico
  // ▪ Permita seleccionar una fecha anterior hasta la fecha para la revisión CTM en la bandeja de Control Técnico Médico.
  // ▪ Y no permita seleccionar fechas posteriores a la fecha actual
  private checkDocumentManagementDateSendRange({ documentManagementSendDate }: TariffControl, { currentStageDate }: Process) {
    const currentDateDayjs = dayjs();
    const processStageDateDayjs = dayjs(currentStageDate);
    const documentManagementSendDateDayjs = dayjs(documentManagementSendDate);

    if (!documentManagementSendDateDayjs.isBetween(processStageDateDayjs, currentDateDayjs, 'days', '[]')) {
      throw new HttpException(
        `${ErrorMessage.TARIFF_CTRL_DOCUMENT_MANAGEMENT_SEND_DATE_INVALID.MSG}. El campo documentManagementSendDate '${documentManagementSendDateDayjs.format('YYYY-MM-DD')}' debe estar entre '${processStageDateDayjs.format('YYYY-MM-DD')}' y '${currentDateDayjs.format('YYYY-MM-DD')}'`,
        ErrorMessage.TARIFF_CTRL_DOCUMENT_MANAGEMENT_SEND_DATE_INVALID.CODE,
      );
    }
  }

  private checkApprovedValue(approvedValue: number, requestedAmount: number) {
    if (approvedValue > requestedAmount && approvedValue < 0)
      throw new HttpException(ErrorMessage.TARIFF_CTRL_OBJECTED_VALUE.MSG, ErrorMessage.TARIFF_CTRL_OBJECTED_VALUE.CODE);
  }
}
