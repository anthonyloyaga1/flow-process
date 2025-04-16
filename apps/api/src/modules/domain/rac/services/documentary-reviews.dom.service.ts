import { HttpException, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { StageProcessesEnum, StageProcessesMessages, StatusProcessesEnum, StatusProcessMessages } from '../../../../shared/constants/processes';
import { DocumentaryReviewsRepository } from '../../../infraestructure/database/repositories/documentary-reviews.repository';
import { ProcessesRepository } from '../../../infraestructure/database/repositories/processes.repository';
import { updateData } from '../../common/helpers/handler-changes-objects';
import { DocumentaryReview } from '../models/documentary-review';
import { Process } from '../models/process';

dayjs.extend(isBetween);

@Injectable()
export class DocumentaryReviewsDomService {
  constructor(
    private readonly documentaryReviewsRepository: DocumentaryReviewsRepository,
    private readonly processRepository: ProcessesRepository,
  ) {}

  async create(body: DocumentaryReview) {
    //* Precarga de datos
    const process = await this.processRepository.findOneById(body.processId);

    //* Validaciones internas
    this.checkProcessExists(process);
    this.checkProcessIsPendingApproval(process);
    this.checkProcessInDocumentaryReviewStage(process);
    await this.checkForExistingDocumentaryReview(body);

    //* CU003-FB6.1.1.1: Validación rango de fechas para fecha de revisión documental
    this.checkReviewDateRange(body, process);

    //* CU003-FB6.1.1.2: Validación de motivo de retraso (delayReason) requerido si la diferencia de días es mayor a 10 (>10)
    this.checkReviewDateDelay(body, process);

    //* CU003-FB6.1.2.1: Validación rango de fechas para fecha de entrega de expedientes
    this.checkFilesDeliveryDateRange(body, process);

    if (body?.process?.returnStageId) {
      //* Validaciones internas
      this.checkStageDifference(process, body.process);
      this.checkReturnStageAllowed(process, body.process);
      this.checkProcessUnderReviewAndRejected(process, body.process);

      const updatedProcess: Partial<Process> = {
        id: body.id,
        returnStageId: body.process.returnStageId,
        returnStageReason: body.process.returnStageReason,
        returnStageBy: body.process.returnStageBy,
        returnStageByName: body.process.returnStageByName,
        statusId: StatusProcessesEnum.PENDIENTE_APROBACION_RETORNO,
        modifiedAt: new Date(),
        modifiedBy: body.modifiedBy,
        returnStageDate: new Date(),
        rejected: body.process.rejected,
      };

      body.currentStageStartDate = process.currentStageDate;
      const documentaryReviewReturnedSaved = await this.documentaryReviewsRepository.transactionDocumentaryReviewReturnProcess(body, updatedProcess);
      return documentaryReviewReturnedSaved;
    }

    body.currentStageStartDate = process.currentStageDate;
    const documentaryReviewSaved = await this.documentaryReviewsRepository.transactionDocumentaryReviewProcessStatus(
      body,
      StatusProcessesEnum.GUARDADO_BORRADOR,
    );
    return documentaryReviewSaved;
  }

  async findOneById(id: number): Promise<DocumentaryReview> {
    const documentaryReview = await this.documentaryReviewsRepository.findOneBasicById(id);
    this.checkExistDocumentaryReview(documentaryReview);

    return documentaryReview;
  }

  async findOneByProcessId(processId: number): Promise<DocumentaryReview> {
    const documentaryReview = await this.documentaryReviewsRepository.findOneByProcessId(processId);
    this.checkExistDocumentaryReview(documentaryReview);

    return documentaryReview;
  }

  async update(body: DocumentaryReview): Promise<DocumentaryReview> {
    const documentaryReview = await this.documentaryReviewsRepository.findOneBasicById(body.id);
    this.checkExistDocumentaryReview(documentaryReview);

    const process = await this.processRepository.findOneById(documentaryReview.processId);
    this.checkProcessInDocumentaryReviewStage(process);
    this.checkProcessIsPendingApproval(process);

    //* CU0003_SF01.6.1.1.3 Fecha de segunda revisión (Obligatorio): Este campo se habilita sólo para los
    this.checkSecondReviewDate(process, documentaryReview, body);

    const updatedDocumentaryReview = updateData(body, documentaryReview);

    if (body?.process?.returnStageId) {
      //* Validaciones internas
      this.checkStageDifference(process, body.process);
      this.checkReturnStageAllowed(process, body.process);
      this.checkProcessUnderReviewAndRejected(process, body.process);

      const updatedProcess: Partial<Process> = {
        id: body.id,
        returnStageId: body.process.returnStageId,
        returnStageReason: body.process.returnStageReason,
        returnStageBy: body.process.returnStageBy,
        returnStageByName: body.process.returnStageByName,
        statusId: StatusProcessesEnum.PENDIENTE_APROBACION_RETORNO,
        modifiedAt: new Date(),
        modifiedBy: body.modifiedBy,
        returnStageDate: new Date(),
        rejected: body.process.rejected,
      };

      const documentaryReviewReturnedSaved = await this.documentaryReviewsRepository.transactionDocumentaryReviewReturnProcess(
        updatedDocumentaryReview,
        updatedProcess,
      );
      return documentaryReviewReturnedSaved;
    }

    const documentaryReviewSaved = await this.documentaryReviewsRepository.transactionDocumentaryReviewProcessStatus(
      updatedDocumentaryReview,
      StatusProcessesEnum.GUARDADO_BORRADOR,
    );
    return documentaryReviewSaved;
  }

  private checkExistDocumentaryReview(documentaryReview: DocumentaryReview) {
    if (!documentaryReview) throw new HttpException(ErrorMessage.DOC_REV_NOT_FOUND.MSG, ErrorMessage.DOC_REV_NOT_FOUND.CODE);
  }

  private checkProcessExists(process: Process) {
    if (!process) throw new HttpException(ErrorMessage.PROCESS_NOT_FOUND.MSG, ErrorMessage.PROCESS_NOT_FOUND.CODE);
  }

  private async checkForExistingDocumentaryReview(body: DocumentaryReview) {
    const documentaryReviewExist = await this.documentaryReviewsRepository.existDocumentaryReviewByProcessId(body.processId);
    if (documentaryReviewExist) throw new HttpException(ErrorMessage.DOC_REV_EXIST.MSG, ErrorMessage.DOC_REV_EXIST.CODE);
  }

  private checkProcessIsPendingApproval(process: Process) {
    if (process.statusId === StatusProcessesEnum.PENDIENTE_APROBACION_RETORNO) {
      throw new HttpException(
        ErrorMessage.PROCESS_NOT_ALLOWED_APPROVE_RETURN.MSG + StatusProcessMessages[process.statusId],
        ErrorMessage.PROCESS_NOT_ALLOWED_APPROVE_RETURN.CODE,
      );
    }
  }

  private checkProcessInDocumentaryReviewStage(process: Process) {
    if (process.currentStageId !== StageProcessesEnum.REVISION_DOCUMENTAL) {
      throw new HttpException(
        ErrorMessage.PROCESS_NOT_IN_DOCUMENTARY_REVIEW.MSG + StageProcessesMessages[process.currentStageId],
        ErrorMessage.PROCESS_NOT_IN_DOCUMENTARY_REVIEW.CODE,
      );
    }
  }

  //* CU003-FB6-1-1-1: Valdiaciones de flujo básico
  // - Por defecto se coloca la fecha actual
  // - Permite seleccionar una fecha anterior hasta la fecha para la revisión documental en la bandeja de Revisión Documental.
  // - Y no permite seleccionar un día después a la fecha actual
  private checkReviewDateRange({ reviewDate }: DocumentaryReview, { currentStageDate }: Process) {
    const currentDateDayjs = dayjs();
    const processStageDateDayjs = dayjs(currentStageDate);
    const reviewDateDayjs = dayjs(reviewDate);

    if (!reviewDateDayjs.isBetween(processStageDateDayjs, currentDateDayjs, 'days', '[]')) {
      throw new HttpException(
        `${ErrorMessage.DOC_REV_DATE_INVALID.MSG}. El campo reviewDate '${reviewDateDayjs.format('YYYY-MM-DD')}' debe estar entre '${processStageDateDayjs.format('YYYY-MM-DD')}' y '${currentDateDayjs.format('YYYY-MM-DD')}'`,
        ErrorMessage.DOC_REV_DATE_INVALID.CODE,
      );
    }
  }

  //* CU003-FB6-1-1-2: Validaciones de flujo básico
  // - Motivo de retraso de revisión (Obligatorio): Texto de 200 caracteres. Este campo
  // se habilita sólo si existe una diferencia de 10 días entre la fecha de inicio revisión
  // documental y la fecha para la revisión documental
  private checkReviewDateDelay({ reviewDate, delayReason }: DocumentaryReview, { currentStageDate }: Process) {
    const reviewDateDayjs = dayjs(reviewDate);
    const processStageDateDayjs = dayjs(currentStageDate).format('YYYY-MM-DD');

    const dateDiff = reviewDateDayjs.diff(processStageDateDayjs, 'days');
    if (dateDiff > 10 && !delayReason) {
      throw new HttpException(ErrorMessage.DOC_REV_DELAY_REASON_REQUIRED.MSG, ErrorMessage.DOC_REV_DELAY_REASON_REQUIRED.CODE);
    }
  }

  //* CU003-FB6-1-2-1: : Validaciones de flujo básico
  // ▪ Permita seleccionar una fecha anterior hasta la fecha para la revisión
  // documental en la bandeja de Revisión Documental.
  // ▪ Y no permita seleccionar fechas posteriores a la fecha actual
  private checkFilesDeliveryDateRange({ filesDeliveryDate }: DocumentaryReview, { currentStageDate }: Process) {
    const currentDateDayjs = dayjs();
    const processStageDateDayjs = dayjs(currentStageDate);
    const filesDeliveryDateDayjs = dayjs(filesDeliveryDate);

    if (!filesDeliveryDateDayjs.isBetween(processStageDateDayjs, currentDateDayjs, 'days', '[]')) {
      throw new HttpException(
        `${ErrorMessage.DOC_REV_FILES_DELIVERY_DATE_INVALID.MSG}. El campo filesDeliveryDate '${filesDeliveryDateDayjs.format('YYYY-MM-DD')}' debe estar entre '${processStageDateDayjs.format('YYYY-MM-DD')}' y '${currentDateDayjs.format('YYYY-MM-DD')}'`,
        ErrorMessage.DOC_REV_FILES_DELIVERY_DATE_INVALID.CODE,
      );
    }
  }

  //* CU0002_SF01_6.1.1.3 o Fecha de segunda revisión (Obligatorio): Este campo se habilita sólo para los
  // trámites que tenga “-R” en el Nro. de trámite. Formato dd-mm-aaaa. La fecha de
  // segunda revisión debe estar dentro del mes siguiente del campo Fecha de inicio
  // de revisión documental (reviewDate). Adicional debe inhabilitar el campo Fecha de inicio revisión
  // documental y la sección retornar
  private checkSecondReviewDate(process: Process, currrentDocumentaryReview: DocumentaryReview, body: DocumentaryReview) {
    if (process.rejected && !body.secondReviewDate) {
      throw new HttpException(ErrorMessage.DOC_REV_SECOND_REVIEW_DATE_REQUIRED.MSG, ErrorMessage.DOC_REV_SECOND_REVIEW_DATE_REQUIRED.CODE);
    }
    if (process.rejected && body.secondReviewDate) {
      const reviewDate = dayjs(currrentDocumentaryReview.reviewDate);
      const secondReviewDate = dayjs(body.secondReviewDate);

      const firstDayOfNextMonth = reviewDate.add(1, 'month').startOf('month');
      const lastDayOfNextMonth = reviewDate.add(1, 'month').endOf('month');

      if (!secondReviewDate.isBetween(firstDayOfNextMonth, lastDayOfNextMonth, 'days', '[]')) {
        throw new HttpException(
          `${ErrorMessage.DOC_REV_SECOND_REVIEW_DATE_INVALID.MSG}. El campo secondReviewDate '${dayjs(body.secondReviewDate).format('YYYY-MM-DD')}' debe estar entre '${dayjs(firstDayOfNextMonth).add(1, 'day').format('YYYY-MM-DD')}' y '${dayjs(lastDayOfNextMonth).add(1, 'month').format('YYYY-MM-DD')}'`,
          ErrorMessage.DOC_REV_SECOND_REVIEW_DATE_INVALID.CODE,
        );
      }
    }
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
}
