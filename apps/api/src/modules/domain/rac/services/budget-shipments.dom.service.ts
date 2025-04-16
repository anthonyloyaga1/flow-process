import { HttpException, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { StageProcessesEnum, StageProcessesMessages, StatusProcessesEnum, StatusProcessMessages } from '../../../../shared/constants/processes';
import { BudgetShipmentsRepository } from '../../../infraestructure/database/repositories/budget-shipments.repository';
import { ProcessesRepository } from '../../../infraestructure/database/repositories/processes.repository';
import { updateData } from '../../common/helpers/handler-changes-objects';
import { BudgetShipment } from '../models/budget-shipment';
import { Process } from '../models/process';

dayjs.extend(isBetween);

@Injectable()
export class BudgetShipmentsDomService {
  constructor(
    private readonly budgetShipmentRepository: BudgetShipmentsRepository,
    private readonly processRepository: ProcessesRepository,
  ) {}

  async create(body: BudgetShipment) {
    const process = await this.processRepository.findOneBasicById(body.processId);

    //* Validaciones internas
    this.checkProcessExists(process);
    this.checkProcessIsPendingApproval(process);
    this.checkProcessInBudgetShipmentStage(process);
    await this.checkForExistingBudgetShipment(body);

    //* CU006.FB6.1.1.1: Validaciones rango de fechas para fecha de solicitud de presupuesto
    this.checkBudgetRequestDateRange(body, process);

    //* CU006.FB6.1.1.3: Validación rangos de fechas para fecha de entrega de facturas
    this.checkInvoiceDeliveryDateRange(body, process);

    //* CU006-FB6.1.1.4: Validación rango de fechas para fecha de entrega de expedientes
    this.checkInvoiceRequestDateRange(body, process);

    body.currentStageStartDate = process.currentStageDate;
    const budgetShipmentSaved = await this.budgetShipmentRepository.transactionBudgetShipmentProcessStatus(
      body,
      StatusProcessesEnum.GUARDADO_BORRADOR,
    );
    return budgetShipmentSaved;
  }

  async findOneById(id: number): Promise<BudgetShipment> {
    const budgetShipment = await this.budgetShipmentRepository.findOneBasicById(id);
    this.checkExistBudgetShipment(budgetShipment);

    return budgetShipment;
  }

  async findOneByProcessId(processId: number): Promise<BudgetShipment> {
    const budgetShipment = await this.budgetShipmentRepository.findOneByProcessId(processId);
    this.checkExistBudgetShipment(budgetShipment);

    return budgetShipment;
  }

  async update(body: BudgetShipment): Promise<BudgetShipment> {
    const budgetShipment = await this.budgetShipmentRepository.findOneBasicById(body.id);
    this.checkExistBudgetShipment(budgetShipment);

    const process = await this.processRepository.findOneBasicById(budgetShipment.processId);
    this.checkProcessInBudgetShipmentStage(process);
    this.checkProcessIsPendingApproval(process);

    const updatedBudgetShipment = updateData(body, budgetShipment);
    const budgetShipmentSaved = await this.budgetShipmentRepository.transactionBudgetShipmentProcessStatus(
      updatedBudgetShipment,
      StatusProcessesEnum.GUARDADO_BORRADOR,
    );
    return budgetShipmentSaved;
  }

  private checkExistBudgetShipment(budgetShipment: BudgetShipment) {
    if (!budgetShipment) throw new HttpException(ErrorMessage.BUDGET_SHIP_NOT_FOUND.MSG, ErrorMessage.BUDGET_SHIP_NOT_FOUND.CODE);
  }

  private checkProcessExists(process: Process) {
    if (!process) throw new HttpException(ErrorMessage.PROCESS_NOT_FOUND.MSG, ErrorMessage.PROCESS_NOT_FOUND.CODE);
  }

  private checkProcessInBudgetShipmentStage(process: Process) {
    if (process.currentStageId !== StageProcessesEnum.ENVIO_A_PRESUPUESTO) {
      throw new HttpException(
        ErrorMessage.PROCESS_NOT_IN_BUDGET_SHIPMENT_STAGE.MSG + StageProcessesMessages[process.currentStageId],
        ErrorMessage.PROCESS_NOT_IN_BUDGET_SHIPMENT_STAGE.CODE,
      );
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

  private async checkForExistingBudgetShipment(body: BudgetShipment) {
    const budgetShipmentExist = await this.budgetShipmentRepository.existBudgetShipmentByProcessId(body.processId);
    if (budgetShipmentExist) throw new HttpException(ErrorMessage.BUDGET_SHIP_EXIST.MSG, ErrorMessage.BUDGET_SHIP_EXIST.CODE);
  }

  //* CU006.FB6.1.1.1: Validaciones rango de fechas para fecha de solicitud de presupuesto
  private checkBudgetRequestDateRange({ budgetRequestDate }: BudgetShipment, { currentStageDate }: Process) {
    const budgetRequestDateDayjs = dayjs(budgetRequestDate);
    const processStageDateDayjs = dayjs(currentStageDate);
    const currentDateDayjs = dayjs();

    if (!budgetRequestDateDayjs.isBetween(processStageDateDayjs, currentDateDayjs, 'day', '[]'))
      throw new HttpException(
        `${ErrorMessage.BUDGET_SHIP_BUDGET_REQUEST_DATE_INVALID.MSG}. El campo budgetRequestDate '${budgetRequestDateDayjs.format('YYYY-MM-DD')}' debe estar entre '${processStageDateDayjs.format('YYYY-MM-DD')}' y '${currentDateDayjs.format('YYYY-MM-DD')}'`,
        ErrorMessage.BUDGET_SHIP_BUDGET_REQUEST_DATE_INVALID.CODE,
      );
  }

  //* CU006.FB6.1.1.3: Validación rangos de fechas para fecha de entrega de envío de facturas
  private checkInvoiceDeliveryDateRange({ invoiceDeliveryDate }: BudgetShipment, { currentStageDate }: Process) {
    const invoiceDeliveryDateDayjs = dayjs(invoiceDeliveryDate);
    const processStageDateDayjs = dayjs(currentStageDate);
    const currentDateDayjs = dayjs();

    if (!invoiceDeliveryDateDayjs.isBetween(processStageDateDayjs, currentDateDayjs, 'day', '[]'))
      throw new HttpException(
        `${ErrorMessage.BUDGET_SHIP_INVOICE_DELIVERY_DATE_INVALID.MSG}. El campo invoiceDeliveryDate '${invoiceDeliveryDateDayjs.format('YYYY-MM-DD')}' debe estar entre '${processStageDateDayjs.format('YYYY-MM-DD')}' y '${currentDateDayjs.format('YYYY-MM-DD')}'`,
        ErrorMessage.BUDGET_SHIP_INVOICE_DELIVERY_DATE_INVALID.CODE,
      );
  }

  //* CU006-FB6.1.1.4: Validación rango de fechas para fecha de entrega de facturas
  private checkInvoiceRequestDateRange({ invoiceRequestDate }: BudgetShipment, { currentStageDate }: Process) {
    const invoiceRequestDateDayjs = dayjs(invoiceRequestDate);
    const processStageDateDayjs = dayjs(currentStageDate);
    const currentDateDayjs = dayjs();

    if (!invoiceRequestDateDayjs.isBetween(processStageDateDayjs, currentDateDayjs, 'day', '[]'))
      throw new HttpException(
        `${ErrorMessage.BUDGET_SHIP_INVOICE_REQUEST_DATE_INVALID.MSG}. El campo invoiceRequestDate '${invoiceRequestDateDayjs.format('YYYY-MM-DD')}' debe estar entre '${processStageDateDayjs.format('YYYY-MM-DD')}' y '${currentDateDayjs.format('YYYY-MM-DD')}'`,
        ErrorMessage.BUDGET_SHIP_INVOICE_REQUEST_DATE_INVALID.CODE,
      );
  }
}
