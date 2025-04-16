import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as dayjs from 'dayjs';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { StageProcessesEnum, StageProcessesMessages, StatusProcessesEnum, StatusProcessMessages } from '../../../../shared/constants/processes';
import { BudgetShipmentsRepository } from '../../../infraestructure/database/repositories/budget-shipments.repository';
import { ProcessesRepository } from '../../../infraestructure/database/repositories/processes.repository';
import { Process } from '../models/process';
import { BudgetShipment } from '../models/budget-shipment';
import { BudgetShipmentsDomService } from '../services/budget-shipments.dom.service';

describe('BudgetShipmentsDomService', () => {
  let service: BudgetShipmentsDomService;
  let budgetShipmentRepository: BudgetShipmentsRepository;
  let processRepository: ProcessesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetShipmentsDomService,
        {
          provide: BudgetShipmentsRepository,
          useValue: {
            insert: jest.fn(),
            findOneBasicById: jest.fn(),
            findOneByProcessId: jest.fn(),
            existBudgetShipmentByProcessId: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: ProcessesRepository,
          useValue: {
            findOneBasicById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BudgetShipmentsDomService>(BudgetShipmentsDomService);
    budgetShipmentRepository = module.get<BudgetShipmentsRepository>(BudgetShipmentsRepository);
    processRepository = module.get<ProcessesRepository>(ProcessesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a budget shipment', async () => {
      const body: BudgetShipment = {
        processId: 1,
        budgetRequestDate: dayjs().format('YYYY-MM-DD'),
        invoiceDeliveryDate: dayjs().format('YYYY-MM-DD'),
        invoiceRequestDate: dayjs().format('YYYY-MM-DD'),
      } as BudgetShipment;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.ENVIO_A_PRESUPUESTO,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
        currentStageDate: dayjs().subtract(1, 'day').toDate(),
      } as Process;

      jest.spyOn(processRepository, 'findOneBasicById').mockResolvedValue(process);
      jest.spyOn(budgetShipmentRepository, 'existBudgetShipmentByProcessId').mockResolvedValue(false);
      jest.spyOn(budgetShipmentRepository, 'insert').mockResolvedValue(body);

      const result = await service.create(body);

      expect(result).toBe(body);
      expect(processRepository.findOneBasicById).toHaveBeenCalledWith(body.processId);
      expect(budgetShipmentRepository.existBudgetShipmentByProcessId).toHaveBeenCalledWith(body.processId);
      expect(budgetShipmentRepository.insert).toHaveBeenCalledWith(body);
    });

    it('should throw an exception if the process does not exist', async () => {
      const body: BudgetShipment = { processId: 1 } as BudgetShipment;

      jest.spyOn(processRepository, 'findOneBasicById').mockResolvedValue(null);

      await expect(service.create(body)).rejects.toThrow(new HttpException(ErrorMessage.PROCESS_NOT_FOUND.MSG, ErrorMessage.PROCESS_NOT_FOUND.CODE));
    });

    it('should throw an exception if the process is not pending approval', async () => {
      const body: BudgetShipment = { processId: 1 } as BudgetShipment;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.ENVIO_A_PRESUPUESTO,
        statusId: StatusProcessesEnum.PENDIENTE_APROBACION_RETORNO,
      } as Process;

      jest.spyOn(processRepository, 'findOneBasicById').mockResolvedValue(process);

      await expect(service.create(body)).rejects.toThrow(
        new HttpException(
          ErrorMessage.PROCESS_NOT_ALLOWED_APPROVE_RETURN.MSG + StatusProcessMessages[process.statusId],
          ErrorMessage.PROCESS_NOT_ALLOWED_APPROVE_RETURN.CODE,
        ),
      );
    });

    it('should throw an exception if the process is not in budget shipment stage', async () => {
      const body: BudgetShipment = { processId: 1 } as BudgetShipment;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.REVISION_DOCUMENTAL,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
      } as Process;

      jest.spyOn(processRepository, 'findOneBasicById').mockResolvedValue(process);

      await expect(service.create(body)).rejects.toThrow(
        new HttpException(
          ErrorMessage.PROCESS_NOT_IN_BUDGET_SHIPMENT_STAGE.MSG + StageProcessesMessages[process.currentStageId],
          ErrorMessage.PROCESS_NOT_IN_BUDGET_SHIPMENT_STAGE.CODE,
        ),
      );
    });

    it('should throw an exception if a budget shipment already exists for the process', async () => {
      const body: BudgetShipment = { processId: 1 } as BudgetShipment;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.ENVIO_A_PRESUPUESTO,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
      } as Process;

      jest.spyOn(processRepository, 'findOneBasicById').mockResolvedValue(process);
      jest.spyOn(budgetShipmentRepository, 'existBudgetShipmentByProcessId').mockResolvedValue(true);

      await expect(service.create(body)).rejects.toThrow(new HttpException(ErrorMessage.BUDGET_SHIP_EXIST.MSG, ErrorMessage.BUDGET_SHIP_EXIST.CODE));
    });

    it('should throw an exception if the budget request date is out of range', async () => {
      const body: BudgetShipment = {
        processId: 1,
        budgetRequestDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
        invoiceDeliveryDate: dayjs().format('YYYY-MM-DD'),
        invoiceRequestDate: dayjs().format('YYYY-MM-DD'),
      } as BudgetShipment;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.ENVIO_A_PRESUPUESTO,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
        currentStageDate: dayjs().subtract(1, 'day').toDate(),
      } as Process;

      const budgetRequestDateDayjs = dayjs(body.budgetRequestDate);
      const processStageDateDayjs = dayjs(process.currentStageDate);
      const currentDateDayjs = dayjs();

      jest.spyOn(processRepository, 'findOneBasicById').mockResolvedValue(process);

      await expect(service.create(body)).rejects.toThrow(
        new HttpException(
          `${ErrorMessage.BUDGET_SHIP_BUDGET_REQUEST_DATE_INVALID.MSG}. El campo budgetRequestDate '${budgetRequestDateDayjs.format('YYYY-MM-DD')}' debe estar entre '${processStageDateDayjs.format('YYYY-MM-DD')}' y '${currentDateDayjs.format('YYYY-MM-DD')}'`,
          ErrorMessage.BUDGET_SHIP_BUDGET_REQUEST_DATE_INVALID.CODE,
        ),
      );
    });

    it('should throw an exception if the invoice delivery date is date is out of range', async () => {
      const body: BudgetShipment = {
        processId: 1,
        budgetRequestDate: dayjs().format('YYYY-MM-DD'),
        invoiceDeliveryDate: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
        invoiceRequestDate: dayjs().format('YYYY-MM-DD'),
      } as BudgetShipment;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.ENVIO_A_PRESUPUESTO,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
        currentStageDate: dayjs().subtract(1, 'day').toDate(),
      } as Process;

      const invoiceDeliveryDateDayjs = dayjs(body.invoiceDeliveryDate);
      const processStageDateDayjs = dayjs(process.currentStageDate);
      const currentDateDayjs = dayjs();

      jest.spyOn(processRepository, 'findOneBasicById').mockResolvedValue(process);

      await expect(service.create(body)).rejects.toThrow(
        new HttpException(
          `${ErrorMessage.BUDGET_SHIP_INVOICE_DELIVERY_DATE_INVALID.MSG}. El campo invoiceDeliveryDate '${invoiceDeliveryDateDayjs.format('YYYY-MM-DD')}' debe estar entre '${processStageDateDayjs.format('YYYY-MM-DD')}' y '${currentDateDayjs.format('YYYY-MM-DD')}'`,
          ErrorMessage.BUDGET_SHIP_INVOICE_DELIVERY_DATE_INVALID.CODE,
        ),
      );
    });

    it('should throw an exception if the invoice request date is out of range', async () => {
      const body: BudgetShipment = {
        processId: 1,
        budgetRequestDate: dayjs().format('YYYY-MM-DD'),
        invoiceDeliveryDate: dayjs().format('YYYY-MM-DD'),
        invoiceRequestDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
      } as BudgetShipment;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.ENVIO_A_PRESUPUESTO,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
        currentStageDate: dayjs().subtract(1, 'day').toDate(),
      } as Process;

      const invoiceRequestDateDayjs = dayjs(body.invoiceRequestDate);
      const processStageDateDayjs = dayjs(process.currentStageDate);
      const currentDateDayjs = dayjs();

      jest.spyOn(processRepository, 'findOneBasicById').mockResolvedValue(process);

      await expect(service.create(body)).rejects.toThrow(
        new HttpException(
          `${ErrorMessage.BUDGET_SHIP_INVOICE_REQUEST_DATE_INVALID.MSG}. El campo invoiceRequestDate '${invoiceRequestDateDayjs.format('YYYY-MM-DD')}' debe estar entre '${processStageDateDayjs.format('YYYY-MM-DD')}' y '${currentDateDayjs.format('YYYY-MM-DD')}'`,
          ErrorMessage.BUDGET_SHIP_INVOICE_REQUEST_DATE_INVALID.CODE,
        ),
      );
    });
  });

  describe('findOneById', () => {
    it('should return a budget shipment by id', async () => {
      const budgetShipment: BudgetShipment = { id: 1 } as BudgetShipment;

      jest.spyOn(budgetShipmentRepository, 'findOneBasicById').mockResolvedValue(budgetShipment);

      const result = await service.findOneById(1);

      expect(result).toBe(budgetShipment);
      expect(budgetShipmentRepository.findOneBasicById).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if the budget shipment does not exist', async () => {
      jest.spyOn(budgetShipmentRepository, 'findOneBasicById').mockResolvedValue(null);

      await expect(service.findOneById(1)).rejects.toThrow(
        new HttpException(ErrorMessage.BUDGET_SHIP_NOT_FOUND.MSG, ErrorMessage.BUDGET_SHIP_NOT_FOUND.CODE),
      );
    });
  });

  describe('findOneByProcessId', () => {
    it('should return a budget shipment by process id', async () => {
      const budgetShipment: BudgetShipment = { processId: 1 } as BudgetShipment;

      jest.spyOn(budgetShipmentRepository, 'findOneByProcessId').mockResolvedValue(budgetShipment);

      const result = await service.findOneByProcessId(1);

      expect(result).toBe(budgetShipment);
      expect(budgetShipmentRepository.findOneByProcessId).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if the budget shipment does not exist', async () => {
      jest.spyOn(budgetShipmentRepository, 'findOneByProcessId').mockResolvedValue(null);

      await expect(service.findOneByProcessId(1)).rejects.toThrow(
        new HttpException(ErrorMessage.BUDGET_SHIP_NOT_FOUND.MSG, ErrorMessage.BUDGET_SHIP_NOT_FOUND.CODE),
      );
    });
  });

  describe('update', () => {
    it('should update a budget shipment', async () => {
      const body: BudgetShipment = { id: 1 } as BudgetShipment;
      const budgetShipment: BudgetShipment = { id: 1, processId: 1 } as BudgetShipment;
      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.ENVIO_A_PRESUPUESTO,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
      } as Process;

      jest.spyOn(budgetShipmentRepository, 'findOneBasicById').mockResolvedValue(budgetShipment);
      jest.spyOn(processRepository, 'findOneBasicById').mockResolvedValue(process);
      jest.spyOn(budgetShipmentRepository, 'update').mockResolvedValue();

      const result = await service.update(body);

      expect(result).toBe(budgetShipment);
      expect(budgetShipmentRepository.findOneBasicById).toHaveBeenCalledWith(body.id);
      expect(processRepository.findOneBasicById).toHaveBeenCalledWith(budgetShipment.processId);
      expect(budgetShipmentRepository.update).toHaveBeenCalledWith(expect.objectContaining(body));
    });

    it('should throw an exception if the budget shipment does not exist', async () => {
      const body: BudgetShipment = { id: 1 } as BudgetShipment;

      jest.spyOn(budgetShipmentRepository, 'findOneBasicById').mockResolvedValue(null);

      await expect(service.update(body)).rejects.toThrow(
        new HttpException(ErrorMessage.BUDGET_SHIP_NOT_FOUND.MSG, ErrorMessage.BUDGET_SHIP_NOT_FOUND.CODE),
      );
    });

    it('should throw an exception if the process is not in budget shipment stage', async () => {
      const body: BudgetShipment = { processId: 1 } as BudgetShipment;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.REVISION_DOCUMENTAL,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
      } as Process;

      jest.spyOn(budgetShipmentRepository, 'findOneBasicById').mockResolvedValue(body);
      jest.spyOn(processRepository, 'findOneBasicById').mockResolvedValue(process);

      await expect(service.update(body)).rejects.toThrow(
        new HttpException(
          ErrorMessage.PROCESS_NOT_IN_BUDGET_SHIPMENT_STAGE.MSG + StageProcessesMessages[process.currentStageId],
          ErrorMessage.PROCESS_NOT_IN_BUDGET_SHIPMENT_STAGE.CODE,
        ),
      );
    });

    it('should throw an exception if the process is not pending approval', async () => {
      const body: BudgetShipment = { processId: 1 } as BudgetShipment;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.ENVIO_A_PRESUPUESTO,
        statusId: StatusProcessesEnum.PENDIENTE_APROBACION_RETORNO,
      } as Process;

      jest.spyOn(budgetShipmentRepository, 'findOneBasicById').mockResolvedValue(body);
      jest.spyOn(processRepository, 'findOneBasicById').mockResolvedValue(process);

      await expect(service.update(body)).rejects.toThrow(
        new HttpException(
          ErrorMessage.PROCESS_NOT_ALLOWED_APPROVE_RETURN.MSG + StatusProcessMessages[process.statusId],
          ErrorMessage.PROCESS_NOT_ALLOWED_APPROVE_RETURN.CODE,
        ),
      );
    });
  });
});
