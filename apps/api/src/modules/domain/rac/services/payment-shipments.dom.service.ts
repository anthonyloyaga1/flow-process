import { HttpException, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { StageProcessesEnum, StageProcessesMessages, StatusProcessesEnum, StatusProcessMessages } from '../../../../shared/constants/processes';
import { PaymentShipmentsRepository } from '../../../infraestructure/database/repositories/payment-shipments.repository';
import { ProcessesRepository } from '../../../infraestructure/database/repositories/processes.repository';
import { updateData } from '../../common/helpers/handler-changes-objects';
import { PaymentShipment } from '../models/payment-shipment';
import { Process } from '../models/process';

dayjs.extend(isBetween);

@Injectable()
export class PaymentShipmentsDomService {
  constructor(
    private readonly paymentShipmentRepository: PaymentShipmentsRepository,
    private readonly processRepository: ProcessesRepository,
  ) {}

  async create(body: PaymentShipment) {
    const process = await this.processRepository.findOneBasicById(body.processId);

    //* Validaciones internas
    this.checkProcessExists(process);
    this.checkProcessIsPendingApproval(process);
    this.checkProcessInPaymentShipmentStage(process);
    await this.checkForExistingPaymentShipment(body);

    //* CU007.FB6.1.1.1: Validaciones para rango de fecha de envío de pago
    this.checkPaymentDateRange(body, process);

    //* CU007.FB6.1.1.2: Validaciones para rango de fecha de envío de archivo
    this.checkFileShipmentDateRange(body, process);

    body.currentStageStartDate = process.currentStageDate;
    const paymentShipmentSaved = await this.paymentShipmentRepository.transactionPaymentShipmentProcessStatus(
      body,
      StatusProcessesEnum.GUARDADO_BORRADOR,
    );
    return paymentShipmentSaved;
  }

  async findOneById(id: number): Promise<PaymentShipment> {
    const paymentShipment = await this.paymentShipmentRepository.findOneBasicById(id);
    this.checkExistPaymentShipment(paymentShipment);

    return paymentShipment;
  }

  async findOneByProcessId(processId: number): Promise<PaymentShipment> {
    const paymentShipment = await this.paymentShipmentRepository.findOneByProcessId(processId);
    this.checkExistPaymentShipment(paymentShipment);

    return paymentShipment;
  }

  async update(body: PaymentShipment): Promise<PaymentShipment> {
    const paymentShipment = await this.paymentShipmentRepository.findOneBasicById(body.id);
    this.checkExistPaymentShipment(paymentShipment);

    const process = await this.processRepository.findOneBasicById(paymentShipment.processId);
    this.checkProcessInPaymentShipmentStage(process);
    this.checkProcessIsPendingApproval(process);

    const updatedPaymentShipment = updateData(body, paymentShipment);
    const paymentShipmentSaved = await this.paymentShipmentRepository.transactionPaymentShipmentProcessStatus(
      updatedPaymentShipment,
      StatusProcessesEnum.GUARDADO_BORRADOR,
    );
    return paymentShipmentSaved;
  }

  private checkExistPaymentShipment(paymentShipment: PaymentShipment) {
    if (!paymentShipment) throw new HttpException(ErrorMessage.PAYMENT_SHIP_NOT_FOUND.MSG, ErrorMessage.PAYMENT_SHIP_NOT_FOUND.CODE);
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

  private checkProcessInPaymentShipmentStage(process: Process) {
    if (process.currentStageId !== StageProcessesEnum.ENVIO_A_PAGO) {
      throw new HttpException(
        ErrorMessage.PROCESS_NOT_IN_TARIFF_CTRL_STAGE.MSG + StageProcessesMessages[process.currentStageId],
        ErrorMessage.PROCESS_NOT_IN_TARIFF_CTRL_STAGE.CODE,
      );
    }
  }

  private async checkForExistingPaymentShipment(body: PaymentShipment) {
    const paymentShipmentExist = await this.paymentShipmentRepository.existPaymentShipmentByProcessId(body.processId);
    if (paymentShipmentExist) throw new HttpException(ErrorMessage.PAYMENT_SHIP_EXIST.MSG, ErrorMessage.PAYMENT_SHIP_EXIST.CODE);
  }

  //* CU007.FB6.1.1.1: Validaciones para rango de fecha de envío de pago
  private checkPaymentDateRange({ paymentShipmentDate }: PaymentShipment, { currentStageDate }: Process) {
    const paymentShipmentDateDayjs = dayjs(paymentShipmentDate);
    const processStageDateDayjs = dayjs(currentStageDate);
    const currentDateDayjs = dayjs();

    if (!paymentShipmentDateDayjs.isBetween(processStageDateDayjs, currentDateDayjs, 'day', '[]'))
      throw new HttpException(
        `${ErrorMessage.PAYMENT_SHIP_PAYMENT_REQUEST_DATE_INVALID.MSG}. El campo paymentShipmentDate '${paymentShipmentDateDayjs.format('YYYY-MM-DD')}' debe estar entre '${processStageDateDayjs.format('YYYY-MM-DD')}' y '${currentDateDayjs.format('YYYY-MM-DD')}'`,
        ErrorMessage.PAYMENT_SHIP_PAYMENT_REQUEST_DATE_INVALID.CODE,
      );
  }

  //* CU007.FB6.1.1.2: Validaciones para rango de fecha de envío de archivo
  private checkFileShipmentDateRange({ fileShipmentDate }: PaymentShipment, { currentStageDate }: Process) {
    const fileShipmentDateDayjs = dayjs(fileShipmentDate);
    const processStageDateDayjs = dayjs(currentStageDate);
    const currentDateDayjs = dayjs();

    if (!fileShipmentDateDayjs.isBetween(processStageDateDayjs, currentDateDayjs, 'day', '[]'))
      throw new HttpException(
        `${ErrorMessage.PAYMENT_SHIP_PAYMENT_REQUEST_DATE_INVALID.MSG}. El campo fileShipmentDate '${fileShipmentDateDayjs.format('YYYY-MM-DD')}' debe estar entre '${processStageDateDayjs.format('YYYY-MM-DD')}' y '${currentDateDayjs.format('YYYY-MM-DD')}'`,
        ErrorMessage.PAYMENT_SHIP_PAYMENT_REQUEST_DATE_INVALID.CODE,
      );
  }
}
