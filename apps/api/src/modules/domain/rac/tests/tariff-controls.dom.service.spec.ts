import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as dayjs from 'dayjs';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { StageProcessesEnum, StageProcessesMessages, StatusProcessesEnum } from '../../../../shared/constants/processes';
import { ProcessesRepository } from '../../../infraestructure/database/repositories/processes.repository';
import { TariffControlsRepository } from '../../../infraestructure/database/repositories/tariff-controls.repository';
import { Process } from '../models/process';
import { TariffControl } from '../models/tariff-control';
import { TariffControlsDomService } from '../services/tariff-controls.dom.service';

describe('TariffControlsDomService', () => {
  let service: TariffControlsDomService;
  let tariffControlsRepository: TariffControlsRepository;
  let processesRepository: ProcessesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TariffControlsDomService,
        {
          provide: TariffControlsRepository,
          useValue: {
            insert: jest.fn(),
            findOneBasicById: jest.fn(),
            findOneByProcessId: jest.fn(),
            existTariffControlByProcessId: jest.fn(),
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

    service = module.get<TariffControlsDomService>(TariffControlsDomService);
    tariffControlsRepository = module.get<TariffControlsRepository>(TariffControlsRepository);
    processesRepository = module.get<ProcessesRepository>(ProcessesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a tariff control', async () => {
      const body: TariffControl = {
        processId: 1,
        liquidationStartDate: dayjs().format('YYYY-MM-DD'),
        filesDeliveryDate: dayjs().format('YYYY-MM-DD'),
        documentManagementSendDate: dayjs().format('YYYY-MM-DD'),
      } as TariffControl;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.REVISION_TARIFAS,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
        currentStageDate: dayjs().subtract(1, 'day').toDate(),
      } as Process;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(process);
      jest.spyOn(tariffControlsRepository, 'existTariffControlByProcessId').mockResolvedValue(false);
      jest.spyOn(tariffControlsRepository, 'insert').mockResolvedValue(body);

      const result = await service.create(body);

      expect(result).toBe(body);
      expect(processesRepository.findOneBasicById).toHaveBeenCalledWith(body.processId);
      expect(tariffControlsRepository.existTariffControlByProcessId).toHaveBeenCalledWith(body.processId);
      expect(tariffControlsRepository.insert).toHaveBeenCalledWith(body);
    });

    it('should throw an exception if the process does not exist', async () => {
      const body: TariffControl = { processId: 1 } as TariffControl;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(null);

      await expect(service.create(body)).rejects.toThrow(new HttpException(ErrorMessage.PROCESS_NOT_FOUND.MSG, ErrorMessage.PROCESS_NOT_FOUND.CODE));
    });

    it('should throw an exception if the process is not in tariff control stage', async () => {
      const body: TariffControl = { processId: 1 } as TariffControl;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.CONTROL_TECNICO_MEDICO,
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

    it('should throw an exception if a tariff control already exists for the process', async () => {
      const body: TariffControl = { processId: 1 } as TariffControl;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.REVISION_TARIFAS,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
      } as Process;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(process);
      jest.spyOn(tariffControlsRepository, 'existTariffControlByProcessId').mockResolvedValue(true);

      await expect(service.create(body)).rejects.toThrow(new HttpException(ErrorMessage.TARIFF_CTRL_EXIST.MSG, ErrorMessage.TARIFF_CTRL_EXIST.CODE));
    });

    it('should throw an exception if the liquidation start date is out of range', async () => {
      const body: TariffControl = {
        processId: 1,
        liquidationStartDate: dayjs().subtract(31, 'day').format('YYYY-MM-DD'),
        filesDeliveryDate: dayjs().format('YYYY-MM-DD'),
        documentManagementSendDate: dayjs().format('YYYY-MM-DD'),
      } as TariffControl;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.REVISION_TARIFAS,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
        currentStageDate: dayjs().subtract(1, 'day').toDate(),
      } as Process;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(process);

      await expect(service.create(body)).rejects.toThrow(
        new HttpException(
          `${ErrorMessage.TARIFF_CTRL_START_DATE_RELEVANCE.MSG}. El campo liquidationStartDate '${dayjs(body.liquidationStartDate).format('YYYY-MM-DD')}' debe estar entre '${dayjs(process.currentStageDate).format('YYYY-MM-DD')}' y '${dayjs().format('YYYY-MM-DD')}'`,
          ErrorMessage.TARIFF_CTRL_START_DATE_RELEVANCE.CODE,
        ),
      );
    });

    it('should throw an exception if the files delivery date is out of range', async () => {
      const body: TariffControl = {
        processId: 1,
        liquidationStartDate: dayjs().format('YYYY-MM-DD'),
        filesDeliveryDate: dayjs().subtract(31, 'day').format('YYYY-MM-DD'),
        documentManagementSendDate: dayjs().format('YYYY-MM-DD'),
      } as TariffControl;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.REVISION_TARIFAS,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
        currentStageDate: dayjs().subtract(1, 'day').toDate(),
      } as Process;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(process);

      await expect(service.create(body)).rejects.toThrow(
        new HttpException(
          `${ErrorMessage.TARIFF_CTRL_FILES_DELIVERY_DATE_INVALID.MSG}. El campo filesDeliveryDate '${dayjs(body.filesDeliveryDate).format('YYYY-MM-DD')}' debe estar entre '${dayjs(process.currentStageDate).format('YYYY-MM-DD')}' y '${dayjs().format('YYYY-MM-DD')}'`,
          ErrorMessage.TARIFF_CTRL_FILES_DELIVERY_DATE_INVALID.CODE,
        ),
      );
    });

    it('should throw an exception if the document management send date is out of range', async () => {
      const body: TariffControl = {
        processId: 1,
        liquidationStartDate: dayjs().format('YYYY-MM-DD'),
        filesDeliveryDate: dayjs().format('YYYY-MM-DD'),
        documentManagementSendDate: dayjs().subtract(31, 'day').format('YYYY-MM-DD'),
      } as TariffControl;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.REVISION_TARIFAS,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
        currentStageDate: dayjs().subtract(1, 'day').toDate(),
      } as Process;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(process);

      await expect(service.create(body)).rejects.toThrow(
        new HttpException(
          `${ErrorMessage.TARIFF_CTRL_DOCUMENT_MANAGEMENT_SEND_DATE_INVALID.MSG}. El campo documentManagementSendDate '${dayjs(body.documentManagementSendDate).format('YYYY-MM-DD')}' debe estar entre '${dayjs(process.currentStageDate).format('YYYY-MM-DD')}' y '${dayjs().format('YYYY-MM-DD')}'`,
          ErrorMessage.TARIFF_CTRL_DOCUMENT_MANAGEMENT_SEND_DATE_INVALID.CODE,
        ),
      );
    });
  });

  describe('findOneById', () => {
    it('should return a tariff control by id', async () => {
      const tariffControl: TariffControl = {
        id: 1,
        processId: 1,
      } as TariffControl;

      jest.spyOn(tariffControlsRepository, 'findOneBasicById').mockResolvedValue(tariffControl);

      const result = await service.findOneById(1);

      expect(result).toBe(tariffControl);
      expect(tariffControlsRepository.findOneBasicById).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if the tariff control is not found', async () => {
      jest.spyOn(tariffControlsRepository, 'findOneBasicById').mockResolvedValue(null);

      await expect(service.findOneById(1)).rejects.toThrow(
        new HttpException(ErrorMessage.DOC_REV_NOT_FOUND.MSG, ErrorMessage.DOC_REV_NOT_FOUND.CODE),
      );
    });
  });

  describe('findOneByProcessId', () => {
    it('should return a tariff control by process id', async () => {
      const tariffControl: TariffControl = {
        id: 1,
        processId: 1,
      } as TariffControl;

      jest.spyOn(tariffControlsRepository, 'findOneByProcessId').mockResolvedValue(tariffControl);

      const result = await service.findOneByProcessId(1);

      expect(result).toBe(tariffControl);
      expect(tariffControlsRepository.findOneByProcessId).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if the tariff control is not found', async () => {
      jest.spyOn(tariffControlsRepository, 'findOneByProcessId').mockResolvedValue(null);

      await expect(service.findOneByProcessId(1)).rejects.toThrow(
        new HttpException(ErrorMessage.DOC_REV_NOT_FOUND.MSG, ErrorMessage.DOC_REV_NOT_FOUND.CODE),
      );
    });
  });

  describe('update', () => {
    it('should update a tariff control', async () => {
      const body: TariffControl = {
        id: 1,
        processId: 1,
        liquidationStartDate: dayjs().format('YYYY-MM-DD'),
        filesDeliveryDate: dayjs().format('YYYY-MM-DD'),
        documentManagementSendDate: dayjs().format('YYYY-MM-DD'),
      } as TariffControl;

      const tariffControl: TariffControl = {
        id: 1,
        processId: 1,
        liquidationStartDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        filesDeliveryDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        documentManagementSendDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      } as TariffControl;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.REVISION_TARIFAS,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
      } as Process;

      jest.spyOn(tariffControlsRepository, 'findOneBasicById').mockResolvedValue(tariffControl);
      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(process);
      jest.spyOn(tariffControlsRepository, 'update').mockResolvedValue();

      const result = await service.update(body);

      expect(result).toEqual(expect.objectContaining(body));
      expect(tariffControlsRepository.findOneBasicById).toHaveBeenCalledWith(body.id);
      expect(processesRepository.findOneBasicById).toHaveBeenCalledWith(tariffControl.processId);
      expect(tariffControlsRepository.update).toHaveBeenCalledWith(expect.objectContaining(body));
    });

    it('should throw an exception if the tariff control is not found', async () => {
      const body: TariffControl = { id: 1 } as TariffControl;

      jest.spyOn(tariffControlsRepository, 'findOneBasicById').mockResolvedValue(null);

      await expect(service.update(body)).rejects.toThrow(new HttpException(ErrorMessage.DOC_REV_NOT_FOUND.MSG, ErrorMessage.DOC_REV_NOT_FOUND.CODE));
    });

    it('should throw an exception if the process is not in tariff control stage', async () => {
      const body: TariffControl = { id: 1 } as TariffControl;

      const tariffControl: TariffControl = {
        id: 1,
        processId: 1,
      } as TariffControl;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.CUR_POR_DISPARAR,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
      } as Process;

      jest.spyOn(tariffControlsRepository, 'findOneBasicById').mockResolvedValue(tariffControl);
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
