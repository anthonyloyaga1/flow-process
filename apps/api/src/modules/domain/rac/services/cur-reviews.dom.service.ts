import { HttpException, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { StageProcessesEnum, StageProcessesMessages, StatusProcessesEnum, StatusProcessMessages } from '../../../../shared/constants/processes';
import { CurReviewsRepository } from '../../../infraestructure/database/repositories/cur-reviews.repository';
import { ProcessesRepository } from '../../../infraestructure/database/repositories/processes.repository';
import { updateData } from '../../common/helpers/handler-changes-objects';
import { CurReview } from '../models/cur-review';
import { Process } from '../models/process';

dayjs.extend(isBetween);

@Injectable()
export class CurReviewsDomService {
  constructor(
    private readonly curReviewRepository: CurReviewsRepository,
    private readonly processRepository: ProcessesRepository,
  ) {}

  async create(body: CurReview) {
    const process = await this.processRepository.findOneBasicById(body.processId);

    // //* Validaciones internas
    this.checkProcessExists(process);
    this.checkProcessIsPendingApproval(process);
    this.checkProcessInCurReviewStage(process);
    await this.checkForExistingCurReview(body);

    //* CU008.FB6.1.1.4: Verificar si está en estado de pago
    //* CU008.FB6.1.1.4: Verificar rango de fecha de CUR si está PAGADO
    this.checkCurDateRange(body, process);

    body.currentStageStartDate = process.currentStageDate;
    const curReviewSaved = await this.curReviewRepository.transactionCurReviewProcessStatus(body, StatusProcessesEnum.GUARDADO_BORRADOR);
    return curReviewSaved;
  }

  async findOneById(id: number): Promise<CurReview> {
    const curReview = await this.curReviewRepository.findOneBasicById(id);
    this.checkExistCurReview(curReview);

    return curReview;
  }

  async findOneByProcessId(processId: number): Promise<CurReview> {
    const curReview = await this.curReviewRepository.findOneByProcessId(processId);
    this.checkExistCurReview(curReview);

    return curReview;
  }

  async update(body: CurReview): Promise<CurReview> {
    const curReview = await this.curReviewRepository.findOneBasicById(body.id);
    this.checkExistCurReview(curReview);

    const process = await this.processRepository.findOneBasicById(curReview.processId);
    this.checkProcessInCurReviewStage(process);
    this.checkProcessIsPendingApproval(process);

    const updatedCurReview = updateData(body, curReview);
    const curReviewSaved = await this.curReviewRepository.transactionCurReviewProcessStatus(updatedCurReview, StatusProcessesEnum.GUARDADO_BORRADOR);
    return curReviewSaved;
  }

  private checkExistCurReview(curReview: CurReview) {
    if (!curReview) throw new HttpException(ErrorMessage.CUR_REV_NOT_FOUND.MSG, ErrorMessage.CUR_REV_NOT_FOUND.CODE);
  }

  private checkProcessExists(process: Process) {
    if (!process) throw new HttpException(ErrorMessage.PROCESS_NOT_FOUND.MSG, ErrorMessage.PROCESS_NOT_FOUND.CODE);
  }

  private checkProcessIsPendingApproval(process: Process) {
    if (process.statusId === StatusProcessesEnum.PENDIENTE_APROBACION_RETORNO) {
      throw new HttpException(
        ErrorMessage.PROCESS_NOT_ALLOWED_APPROVE_RETURN.MSG + StatusProcessMessages[process.statusId],
        ErrorMessage.PROCESS_NOT_ALLOWED_APPROVE_RETURN.CODE,
      );
    }
  }

  private checkProcessInCurReviewStage(process: Process) {
    if (process.currentStageId !== StageProcessesEnum.CUR_POR_DISPARAR) {
      throw new HttpException(
        ErrorMessage.PROCESS_NOT_IN_CUR_REV_STAGE.MSG + StageProcessesMessages[process.currentStageId],
        ErrorMessage.PROCESS_NOT_IN_CUR_REV_STAGE.CODE,
      );
    }
  }

  private async checkForExistingCurReview(body: CurReview) {
    const curReviewExist = await this.curReviewRepository.existCurReviewByProcessId(body.processId);
    if (curReviewExist) throw new HttpException(ErrorMessage.CUR_REV_EXIST.MSG, ErrorMessage.CUR_REV_EXIST.CODE);
  }

  //* CU008.FB6.1.1.4: Validación rango de fechas para fecha de CUR
  private checkCurDateRange({ curDate }: CurReview, { currentStageDate }: Process) {
    const curDateDayjs = dayjs(curDate);
    const processStageDateDayjs = dayjs(currentStageDate);
    const currentDateDayjs = dayjs();

    if (!curDateDayjs.isBetween(processStageDateDayjs, currentDateDayjs, 'day', '[]'))
      throw new HttpException(
        `${ErrorMessage.CUR_REV_DATE_RANGE_INVALID.MSG}. El campo curDate '${curDateDayjs.format('YYYY-MM-DD')}' debe estar entre '${processStageDateDayjs.format('YYYY-MM-DD')}' y '${currentDateDayjs.format('YYYY-MM-DD')}'`,
        ErrorMessage.CUR_REV_DATE_RANGE_INVALID.CODE,
      );
  }
}
