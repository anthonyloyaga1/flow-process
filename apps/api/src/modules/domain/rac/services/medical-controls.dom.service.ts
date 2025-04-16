import { HttpException, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { StageProcessesEnum, StageProcessesMessages, StatusProcessesEnum, StatusProcessMessages } from '../../../../shared/constants/processes';
import { MedicalControlsRepository } from '../../../infraestructure/database/repositories/medical-controls.repository';
import { ProcessesRepository } from '../../../infraestructure/database/repositories/processes.repository';
import { updateData } from '../../common/helpers/handler-changes-objects';
import { MedicalControl } from '../models/medical-control';
import { Process } from '../models/process';

dayjs.extend(isBetween);

@Injectable()
export class MedicalControlsDomService {
  constructor(
    private readonly medicalControlsRepository: MedicalControlsRepository,
    private readonly processRepository: ProcessesRepository,
  ) {}

  async create(body: MedicalControl) {
    const process = await this.processRepository.findOneBasicById(body.processId);

    //* Validaciones internas
    this.checkProcessExists(process);
    this.checkProcessIsPendingApproval(process);
    this.checkProcessInMedicalControlStage(process);
    await this.checkForExistingMedicalControl(body);

    //* CU004.FB6.1.1.1: Validación rango de fechas para fecha de inicio de pertinencia
    this.checkRelevanceStartDateRange(body, process);

    //* CU004.FB6.1.1.2: Validación de motivo de retraso (delayReason) requerido si la diferencia de días es mayor a 45 días (>45)
    this.checkReviewDateDelay(body, process);

    //* CU004-FB6.1.2.2: Validación rango de fechas para fecha de entrega de expedientes
    this.checkFilesDeliveryDateRange(body, process);

    body.currentStageStartDate = process.currentStageDate;
    const medicalControlSaved = await this.medicalControlsRepository.transactionMedicalControlProcessStatus(
      body,
      StatusProcessesEnum.GUARDADO_BORRADOR,
    );
    return medicalControlSaved;
  }

  async findOneById(id: number): Promise<MedicalControl> {
    const medicalControl = await this.medicalControlsRepository.findOneBasicById(id);
    this.checkExistMedicalControl(medicalControl);

    return medicalControl;
  }

  async findOneByProcessId(processId: number): Promise<MedicalControl> {
    const medicalControl = await this.medicalControlsRepository.findOneByProcessId(processId);
    this.checkExistMedicalControl(medicalControl);

    return medicalControl;
  }

  async update(body: MedicalControl): Promise<MedicalControl> {
    const medicalControl = await this.medicalControlsRepository.findOneBasicById(body.id);
    this.checkExistMedicalControl(medicalControl);

    const process = await this.processRepository.findOneBasicById(medicalControl.processId);
    this.checkProcessInMedicalControlStage(process);
    this.checkProcessIsPendingApproval(process);

    const updatedMedicalControl = updateData(body, medicalControl);
    const medicalControlSaved = await this.medicalControlsRepository.transactionMedicalControlProcessStatus(
      updatedMedicalControl,
      StatusProcessesEnum.GUARDADO_BORRADOR,
    );
    return medicalControlSaved;
  }

  private checkExistMedicalControl(medicalControl: MedicalControl) {
    if (!medicalControl) throw new HttpException(ErrorMessage.DOC_REV_NOT_FOUND.MSG, ErrorMessage.DOC_REV_NOT_FOUND.CODE);
  }

  private checkProcessExists(process: Process) {
    if (!process) throw new HttpException(ErrorMessage.PROCESS_NOT_FOUND.MSG, ErrorMessage.PROCESS_NOT_FOUND.CODE);
  }

  private async checkForExistingMedicalControl(body: MedicalControl) {
    const medicalControlExist = await this.medicalControlsRepository.existMedicalControlByProcessId(body.processId);
    if (medicalControlExist) throw new HttpException(ErrorMessage.MED_CTRL_EXIST.MSG, ErrorMessage.MED_CTRL_EXIST.CODE);
  }

  private checkProcessIsPendingApproval(process: Process) {
    if (process.statusId === StatusProcessesEnum.PENDIENTE_APROBACION_RETORNO) {
      throw new HttpException(
        ErrorMessage.PROCESS_NOT_ALLOWED_APPROVE_RETURN.MSG + StatusProcessMessages[process.statusId],
        ErrorMessage.PROCESS_NOT_ALLOWED_APPROVE_RETURN.CODE,
      );
    }
  }

  private checkProcessInMedicalControlStage(process: Process) {
    if (process.currentStageId !== StageProcessesEnum.CONTROL_TECNICO_MEDICO) {
      throw new HttpException(
        ErrorMessage.PROCESS_NOT_IN_MEDICAL_CONTROL.MSG + StageProcessesMessages[process.currentStageId],
        ErrorMessage.PROCESS_NOT_IN_MEDICAL_CONTROL.CODE,
      );
    }
  }

  //* CU004 FB6.1.1.1: Valdiaciones de flujo básico
  // - Por defecto se coloca la fecha actual
  // - Permite seleccionar una fecha anterior hasta la fecha para la revisión CTM en la bandeja de Control Técnico Médico.
  // - Y no permite seleccionar un día después a la fecha actual
  private checkRelevanceStartDateRange({ startDate }: MedicalControl, { currentStageDate }: Process) {
    const startDateDayjs = dayjs(startDate);
    const processStageDateDayjs = dayjs(currentStageDate);
    const currentDateDayjs = dayjs();

    if (!startDateDayjs.isBetween(processStageDateDayjs, currentDateDayjs, 'day', '[]'))
      throw new HttpException(
        `${ErrorMessage.MED_CTRL_START_DATE_RELEVANCE.MSG}. El campo startDate '${startDateDayjs.format('YYYY-MM-DD')}' debe estar entre '${processStageDateDayjs.format('YYYY-MM-DD')}' y '${currentDateDayjs.format('YYYY-MM-DD')}'`,
        ErrorMessage.MED_CTRL_START_DATE_RELEVANCE.CODE,
      );
  }

  //* CU004.FB6.1.1.2: Validación de motivo de retraso (delayReason) requerido si la diferencia de días es mayor a 45 días (>45)
  // - Motivo de retraso de revisión (Obligatorio): Texto de 200 caracteres. Este campo
  // se habilita sólo si existe una diferencia de 45 días entre la fecha de inicio pertinencia
  // con la fecha para la revisión CTM
  private checkReviewDateDelay({ startDate, delayReason }: MedicalControl, { currentStageDate }: Process) {
    const startDateDayjs = dayjs(startDate);
    const processStageDateDayjs = dayjs(currentStageDate).format('YYYY-MM-DD');

    const dateDiff = startDateDayjs.diff(processStageDateDayjs, 'days');
    if (dateDiff > 45 && !delayReason)
      throw new HttpException(ErrorMessage.MED_CTRL_DELAY_REASON_REQUIRED.MSG, ErrorMessage.MED_CTRL_DELAY_REASON_REQUIRED.CODE);
  }

  //* CU004-FB6.1.2.2: : Validaciones de flujo básico
  // ▪ Permita seleccionar una fecha anterior hasta la fecha para la revisión CTM en la bandeja de Control Técnico Médico.
  // ▪ Y no permita seleccionar fechas posteriores a la fecha actual
  private checkFilesDeliveryDateRange({ filesDeliveryDate }: MedicalControl, { currentStageDate }: Process) {
    const currentDateDayjs = dayjs();
    const processStageDateDayjs = dayjs(currentStageDate);
    const filesDeliveryDateDayjs = dayjs(filesDeliveryDate);

    if (!filesDeliveryDateDayjs.isBetween(processStageDateDayjs, currentDateDayjs, 'days', '[]')) {
      throw new HttpException(
        `${ErrorMessage.MED_CTRL_FILES_DELIVERY_DATE_INVALID.MSG}. El campo filesDeliveryDate '${filesDeliveryDateDayjs.format('YYYY-MM-DD')}' debe estar entre '${processStageDateDayjs.format('YYYY-MM-DD')}' y '${currentDateDayjs.format('YYYY-MM-DD')}'`,
        ErrorMessage.MED_CTRL_FILES_DELIVERY_DATE_INVALID.CODE,
      );
    }
  }
}
