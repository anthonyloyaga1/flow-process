import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as dayjs from 'dayjs';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { StageProcessesEnum, StageProcessesMessages, StatusProcessesEnum, StatusProcessMessages } from '../../../../shared/constants/processes';
import { PaymentShipmentsRepository } from '../../../infraestructure/database/repositories/payment-shipments.repository';
import { ProcessesRepository } from '../../../infraestructure/database/repositories/processes.repository';
import { Process } from '../models/process';
import { PaymentShipment } from '../models/payment-shipment';
import { PaymentShipmentsDomService } from '../services/payment-shipments.dom.service';

describe('PaymentShipmentsDomService', () => {
  let service: PaymentShipmentsDomService;
  let paymentShipmentsRepository: PaymentShipmentsRepository;
  let processesRepository: ProcessesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentShipmentsDomService,
        {
          provide: PaymentShipmentsRepository,
          useValue: {
            insert: jest.fn(),
            findOneBasicById: jest.fn(),
            findOneByProcessId: jest.fn(),
            existPaymentShipmentByProcessId: jest.fn(),
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

    service = module.get<PaymentShipmentsDomService>(PaymentShipmentsDomService);
    paymentShipmentsRepository = module.get<PaymentShipmentsRepository>(PaymentShipmentsRepository);
    processesRepository = module.get<ProcessesRepository>(ProcessesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a payment shipment', async () => {
      const body: PaymentShipment = {
        processId: 1,
        paymentShipmentDate: dayjs().format('YYYY-MM-DD'),
        fileShipmentDate: dayjs().format('YYYY-MM-DD'),
      } as PaymentShipment;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.ENVIO_A_PAGO,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
        currentStageDate: dayjs().subtract(1, 'day').toDate(),
      } as Process;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(process);
      jest.spyOn(paymentShipmentsRepository, 'existPaymentShipmentByProcessId').mockResolvedValue(false);
      jest.spyOn(paymentShipmentsRepository, 'insert').mockResolvedValue(body);

      const result = await service.create(body);

      expect(result).toBe(body);
      expect(processesRepository.findOneBasicById).toHaveBeenCalledWith(body.processId);
      expect(paymentShipmentsRepository.existPaymentShipmentByProcessId).toHaveBeenCalledWith(body.processId);
      expect(paymentShipmentsRepository.insert).toHaveBeenCalledWith(body);
    });

    it('should throw an exception if the process does not exist', async () => {
      const body: PaymentShipment = { processId: 1 } as PaymentShipment;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(null);

      await expect(service.create(body)).rejects.toThrow(new HttpException(ErrorMessage.PROCESS_NOT_FOUND.MSG, ErrorMessage.PROCESS_NOT_FOUND.CODE));
    });

    it('should throw an exception if the process is not pending approval', async () => {
      const body: PaymentShipment = { processId: 1 } as PaymentShipment;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.ENVIO_A_PRESUPUESTO,
        statusId: StatusProcessesEnum.PENDIENTE_APROBACION_RETORNO,
      } as Process;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(process);

      await expect(service.create(body)).rejects.toThrow(
        new HttpException(
          ErrorMessage.PROCESS_NOT_ALLOWED_APPROVE_RETURN.MSG + StatusProcessMessages[process.statusId],
          ErrorMessage.PROCESS_NOT_ALLOWED_APPROVE_RETURN.CODE,
        ),
      );
    });

    it('should throw an exception if the process is not in payment shipment stage', async () => {
      const body: PaymentShipment = { processId: 1 } as PaymentShipment;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.REVISION_DOCUMENTAL,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
      } as Process;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(process);

      await expect(service.create(body)).rejects.toThrow(
        new HttpException(
          ErrorMessage.PROCESS_NOT_IN_TARIFF_CTRL_STAGE.MSG + StageProcessesMessages[process.currentStageId],
          ErrorMessage.PROCESS_NOT_IN_TARIFF_CTRL_STAGE.CODE,
        ),
      );
    });

    it('should throw an exception if a payment shipment already exists for the process', async () => {
      const body: PaymentShipment = { processId: 1 } as PaymentShipment;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.ENVIO_A_PAGO,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
      } as Process;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(process);
      jest.spyOn(paymentShipmentsRepository, 'existPaymentShipmentByProcessId').mockResolvedValue(true);

      await expect(service.create(body)).rejects.toThrow(
        new HttpException(ErrorMessage.PAYMENT_SHIP_EXIST.MSG, ErrorMessage.PAYMENT_SHIP_EXIST.CODE),
      );
    });

    it('should throw an exception if the payment shipment date is out of range', async () => {
      const body: PaymentShipment = {
        processId: 1,
        paymentShipmentDate: dayjs().subtract(31, 'day').format('YYYY-MM-DD'),
        fileShipmentDate: dayjs().format('YYYY-MM-DD'),
      } as PaymentShipment;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.ENVIO_A_PAGO,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
        currentStageDate: dayjs().subtract(1, 'day').toDate(),
      } as Process;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(process);

      await expect(service.create(body)).rejects.toThrow(
        new HttpException(
          `${ErrorMessage.PAYMENT_SHIP_PAYMENT_REQUEST_DATE_INVALID.MSG}. El campo paymentShipmentDate '${dayjs(body.paymentShipmentDate).format('YYYY-MM-DD')}' debe estar entre '${dayjs(process.currentStageDate).format('YYYY-MM-DD')}' y '${dayjs().format('YYYY-MM-DD')}'`,
          ErrorMessage.PAYMENT_SHIP_PAYMENT_REQUEST_DATE_INVALID.CODE,
        ),
      );
    });

    it('should throw an exception if the file shipment date is out of range', async () => {
      const body: PaymentShipment = {
        processId: 1,
        paymentShipmentDate: dayjs().format('YYYY-MM-DD'),
        fileShipmentDate: dayjs().subtract(31, 'day').format('YYYY-MM-DD'),
      } as PaymentShipment;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.ENVIO_A_PAGO,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
        currentStageDate: dayjs().subtract(1, 'day').toDate(),
      } as Process;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(process);

      await expect(service.create(body)).rejects.toThrow(
        new HttpException(
          `${ErrorMessage.PAYMENT_SHIP_PAYMENT_REQUEST_DATE_INVALID.MSG}. El campo fileShipmentDate '${dayjs(body.fileShipmentDate).format('YYYY-MM-DD')}' debe estar entre '${dayjs(process.currentStageDate).format('YYYY-MM-DD')}' y '${dayjs().format('YYYY-MM-DD')}'`,
          ErrorMessage.PAYMENT_SHIP_PAYMENT_REQUEST_DATE_INVALID.CODE,
        ),
      );
    });
  });

  describe('findOneById', () => {
    it('should return a payment shipment by id', async () => {
      const paymentShipment: PaymentShipment = {
        id: 1,
        processId: 1,
      } as PaymentShipment;

      jest.spyOn(paymentShipmentsRepository, 'findOneBasicById').mockResolvedValue(paymentShipment);

      const result = await service.findOneById(1);

      expect(result).toBe(paymentShipment);
      expect(paymentShipmentsRepository.findOneBasicById).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if the payment shipment is not found', async () => {
      jest.spyOn(paymentShipmentsRepository, 'findOneBasicById').mockResolvedValue(null);

      await expect(service.findOneById(1)).rejects.toThrow(
        new HttpException(ErrorMessage.PAYMENT_SHIP_NOT_FOUND.MSG, ErrorMessage.PAYMENT_SHIP_NOT_FOUND.CODE),
      );
    });
  });

  describe('findOneByProcessId', () => {
    it('should return a payment shipment by process id', async () => {
      const paymentShipment: PaymentShipment = {
        id: 1,
        processId: 1,
      } as PaymentShipment;

      jest.spyOn(paymentShipmentsRepository, 'findOneByProcessId').mockResolvedValue(paymentShipment);

      const result = await service.findOneByProcessId(1);

      expect(result).toBe(paymentShipment);
      expect(paymentShipmentsRepository.findOneByProcessId).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if the payment shipment is not found', async () => {
      jest.spyOn(paymentShipmentsRepository, 'findOneByProcessId').mockResolvedValue(null);

      await expect(service.findOneByProcessId(1)).rejects.toThrow(
        new HttpException(ErrorMessage.PAYMENT_SHIP_NOT_FOUND.MSG, ErrorMessage.PAYMENT_SHIP_NOT_FOUND.CODE),
      );
    });
  });

  describe('update', () => {
    it('should update a payment shipment', async () => {
      const body: PaymentShipment = {
        id: 1,
        processId: 1,
        paymentShipmentDate: dayjs().format('YYYY-MM-DD'),
        fileShipmentDate: dayjs().format('YYYY-MM-DD'),
      } as PaymentShipment;

      const paymentShipment: PaymentShipment = {
        id: 1,
        processId: 1,
        paymentShipmentDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        fileShipmentDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      } as PaymentShipment;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.ENVIO_A_PAGO,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
      } as Process;

      jest.spyOn(paymentShipmentsRepository, 'findOneBasicById').mockResolvedValue(paymentShipment);
      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(process);
      jest.spyOn(paymentShipmentsRepository, 'update').mockResolvedValue();

      const result = await service.update(body);

      expect(result).toEqual(expect.objectContaining(body));
      expect(paymentShipmentsRepository.findOneBasicById).toHaveBeenCalledWith(body.id);
      expect(processesRepository.findOneBasicById).toHaveBeenCalledWith(paymentShipment.processId);
      expect(paymentShipmentsRepository.update).toHaveBeenCalledWith(expect.objectContaining(body));
    });

    it('should throw an exception if the payment shipment is not found', async () => {
      const body: PaymentShipment = { id: 1 } as PaymentShipment;

      jest.spyOn(paymentShipmentsRepository, 'findOneBasicById').mockResolvedValue(null);

      await expect(service.update(body)).rejects.toThrow(
        new HttpException(ErrorMessage.PAYMENT_SHIP_NOT_FOUND.MSG, ErrorMessage.PAYMENT_SHIP_NOT_FOUND.CODE),
      );
    });

    it('should throw an exception if the process is not in payment shipment stage', async () => {
      const body: PaymentShipment = { id: 1 } as PaymentShipment;

      const paymentShipment: PaymentShipment = {
        id: 1,
        processId: 1,
      } as PaymentShipment;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.CUR_POR_DISPARAR,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
      } as Process;

      jest.spyOn(paymentShipmentsRepository, 'findOneBasicById').mockResolvedValue(paymentShipment);
      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(process);

      await expect(service.update(body)).rejects.toThrow(
        new HttpException(
          ErrorMessage.PROCESS_NOT_IN_TARIFF_CTRL_STAGE.MSG + StageProcessesMessages[process.currentStageId],
          ErrorMessage.PROCESS_NOT_IN_TARIFF_CTRL_STAGE.CODE,
        ),
      );
    });
  });
});
