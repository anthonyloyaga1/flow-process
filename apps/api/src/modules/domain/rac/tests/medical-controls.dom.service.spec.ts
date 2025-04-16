import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as dayjs from 'dayjs';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { StageProcessesEnum, StageProcessesMessages, StatusProcessesEnum, StatusProcessMessages } from '../../../../shared/constants/processes';
import { MedicalControlsRepository } from '../../../infraestructure/database/repositories/medical-controls.repository';
import { ProcessesRepository } from '../../../infraestructure/database/repositories/processes.repository';
import { Process } from '../models/process';
import { MedicalControl } from '../models/medical-control';
import { MedicalControlsDomService } from '../services/medical-controls.dom.service';

describe('MedicalControlsDomService', () => {
  let service: MedicalControlsDomService;
  let medicalControlsRepository: MedicalControlsRepository;
  let processesRepository: ProcessesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicalControlsDomService,
        {
          provide: MedicalControlsRepository,
          useValue: {
            insert: jest.fn(),
            findOneBasicById: jest.fn(),
            findOneByProcessId: jest.fn(),
            existMedicalControlByProcessId: jest.fn(),
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

    service = module.get<MedicalControlsDomService>(MedicalControlsDomService);
    medicalControlsRepository = module.get<MedicalControlsRepository>(MedicalControlsRepository);
    processesRepository = module.get<ProcessesRepository>(ProcessesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a medical control', async () => {
      const body: MedicalControl = {
        processId: 1,
        startDate: dayjs().format('YYYY-MM-DD'),
        filesDeliveryDate: dayjs().format('YYYY-MM-DD'),
      } as MedicalControl;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.CONTROL_TECNICO_MEDICO,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
        currentStageDate: dayjs().subtract(1, 'day').toDate(),
      } as Process;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(process);
      jest.spyOn(medicalControlsRepository, 'existMedicalControlByProcessId').mockResolvedValue(false);
      jest.spyOn(medicalControlsRepository, 'insert').mockResolvedValue(body);

      const result = await service.create(body);

      expect(result).toBe(body);
      expect(processesRepository.findOneBasicById).toHaveBeenCalledWith(body.processId);
      expect(medicalControlsRepository.existMedicalControlByProcessId).toHaveBeenCalledWith(body.processId);
      expect(medicalControlsRepository.insert).toHaveBeenCalledWith(body);
    });

    it('should throw an exception if the process does not exist', async () => {
      const body: MedicalControl = { processId: 1 } as MedicalControl;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(null);

      await expect(service.create(body)).rejects.toThrow(new HttpException(ErrorMessage.PROCESS_NOT_FOUND.MSG, ErrorMessage.PROCESS_NOT_FOUND.CODE));
    });

    it('should throw an exception if the process is in pending approval return status', async () => {
      const body: MedicalControl = { processId: 1 } as MedicalControl;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.REVISION_DOCUMENTAL,
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

    it('should throw an exception if the process is not in medical control stage', async () => {
      const body: MedicalControl = { processId: 1 } as MedicalControl;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.REVISION_DOCUMENTAL,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
      } as Process;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(process);

      await expect(service.create(body)).rejects.toThrow(
        new HttpException(
          ErrorMessage.PROCESS_NOT_IN_MEDICAL_CONTROL.MSG + StageProcessesMessages[process.currentStageId],
          ErrorMessage.PROCESS_NOT_IN_MEDICAL_CONTROL.CODE,
        ),
      );
    });

    it('should throw an exception if a medical control already exists for the process', async () => {
      const body: MedicalControl = { processId: 1 } as MedicalControl;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.CONTROL_TECNICO_MEDICO,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
      } as Process;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(process);
      jest.spyOn(medicalControlsRepository, 'existMedicalControlByProcessId').mockResolvedValue(true);

      await expect(service.create(body)).rejects.toThrow(new HttpException(ErrorMessage.MED_CTRL_EXIST.MSG, ErrorMessage.MED_CTRL_EXIST.CODE));
    });

    it('should throw an exception if the start date is out of range', async () => {
      const body: MedicalControl = {
        processId: 1,
        startDate: dayjs().subtract(31, 'day').format('YYYY-MM-DD'),
        filesDeliveryDate: dayjs().format('YYYY-MM-DD'),
      } as MedicalControl;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.CONTROL_TECNICO_MEDICO,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
        currentStageDate: dayjs().subtract(1, 'day').toDate(),
      } as Process;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(process);

      await expect(service.create(body)).rejects.toThrow(
        new HttpException(
          `${ErrorMessage.MED_CTRL_START_DATE_RELEVANCE.MSG}. El campo startDate '${dayjs(body.startDate).format('YYYY-MM-DD')}' debe estar entre '${dayjs(process.currentStageDate).format('YYYY-MM-DD')}' y '${dayjs().format('YYYY-MM-DD')}'`,
          ErrorMessage.MED_CTRL_START_DATE_RELEVANCE.CODE,
        ),
      );
    });

    it('should throw an exception if the review date delay is greater than 45 days', async () => {
      const body: MedicalControl = {
        processId: 1,
        startDate: dayjs().format('YYYY-MM-DD'),
        filesDeliveryDate: dayjs().format('YYYY-MM-DD'),
        delayReason: null,
      } as MedicalControl;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.CONTROL_TECNICO_MEDICO,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
        currentStageDate: dayjs().subtract(46, 'day').toDate(),
      } as Process;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(process);

      await expect(service.create(body)).rejects.toThrow(
        new HttpException(ErrorMessage.MED_CTRL_DELAY_REASON_REQUIRED.MSG, ErrorMessage.MED_CTRL_DELAY_REASON_REQUIRED.CODE),
      );
    });

    it('should throw an exception if the files delivery date is out of range', async () => {
      const body: MedicalControl = {
        processId: 1,
        startDate: dayjs().format('YYYY-MM-DD'),
        filesDeliveryDate: dayjs().subtract(31, 'day').format('YYYY-MM-DD'),
      } as MedicalControl;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.CONTROL_TECNICO_MEDICO,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
        currentStageDate: dayjs().subtract(1, 'day').toDate(),
      } as Process;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(process);

      await expect(service.create(body)).rejects.toThrow(
        new HttpException(
          `${ErrorMessage.MED_CTRL_FILES_DELIVERY_DATE_INVALID.MSG}. El campo filesDeliveryDate '${dayjs(body.filesDeliveryDate).format('YYYY-MM-DD')}' debe estar entre '${dayjs(process.currentStageDate).format('YYYY-MM-DD')}' y '${dayjs().format('YYYY-MM-DD')}'`,
          ErrorMessage.MED_CTRL_FILES_DELIVERY_DATE_INVALID.CODE,
        ),
      );
    });
  });

  describe('findOneById', () => {
    it('should return a medical control by id', async () => {
      const medicalControl: MedicalControl = {
        id: 1,
        processId: 1,
      } as MedicalControl;

      jest.spyOn(medicalControlsRepository, 'findOneBasicById').mockResolvedValue(medicalControl);

      const result = await service.findOneById(1);

      expect(result).toBe(medicalControl);
      expect(medicalControlsRepository.findOneBasicById).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if the medical control is not found', async () => {
      jest.spyOn(medicalControlsRepository, 'findOneBasicById').mockResolvedValue(null);

      await expect(service.findOneById(1)).rejects.toThrow(
        new HttpException(ErrorMessage.DOC_REV_NOT_FOUND.MSG, ErrorMessage.DOC_REV_NOT_FOUND.CODE),
      );
    });
  });

  describe('findOneByProcessId', () => {
    it('should return a medical control by process id', async () => {
      const medicalControl: MedicalControl = {
        id: 1,
        processId: 1,
      } as MedicalControl;

      jest.spyOn(medicalControlsRepository, 'findOneByProcessId').mockResolvedValue(medicalControl);

      const result = await service.findOneByProcessId(1);

      expect(result).toBe(medicalControl);
      expect(medicalControlsRepository.findOneByProcessId).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if the medical control is not found', async () => {
      jest.spyOn(medicalControlsRepository, 'findOneByProcessId').mockResolvedValue(null);

      await expect(service.findOneByProcessId(1)).rejects.toThrow(
        new HttpException(ErrorMessage.DOC_REV_NOT_FOUND.MSG, ErrorMessage.DOC_REV_NOT_FOUND.CODE),
      );
    });
  });

  describe('update', () => {
    it('should update a medical control', async () => {
      const body: MedicalControl = {
        id: 1,
        processId: 1,
        startDate: dayjs().format('YYYY-MM-DD'),
        filesDeliveryDate: dayjs().format('YYYY-MM-DD'),
      } as MedicalControl;

      const medicalControl: MedicalControl = {
        id: 1,
        processId: 1,
        startDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        filesDeliveryDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      } as MedicalControl;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.CONTROL_TECNICO_MEDICO,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
      } as Process;

      jest.spyOn(medicalControlsRepository, 'findOneBasicById').mockResolvedValue(medicalControl);
      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(process);
      jest.spyOn(medicalControlsRepository, 'update').mockResolvedValue();

      const result = await service.update(body);

      expect(result).toEqual(expect.objectContaining(body));
      expect(medicalControlsRepository.findOneBasicById).toHaveBeenCalledWith(body.id);
      expect(processesRepository.findOneBasicById).toHaveBeenCalledWith(medicalControl.processId);
      expect(medicalControlsRepository.update).toHaveBeenCalledWith(expect.objectContaining(body));
    });

    it('should throw an exception if the medical control is not found', async () => {
      const body: MedicalControl = { id: 1 } as MedicalControl;

      jest.spyOn(medicalControlsRepository, 'findOneBasicById').mockResolvedValue(null);

      await expect(service.update(body)).rejects.toThrow(new HttpException(ErrorMessage.DOC_REV_NOT_FOUND.MSG, ErrorMessage.DOC_REV_NOT_FOUND.CODE));
    });

    it('should throw an exception if the process is not in medical control stage', async () => {
      const body: MedicalControl = { id: 1 } as MedicalControl;

      const medicalControl: MedicalControl = {
        id: 1,
        processId: 1,
      } as MedicalControl;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.REVISION_DOCUMENTAL,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
      } as Process;

      jest.spyOn(medicalControlsRepository, 'findOneBasicById').mockResolvedValue(medicalControl);
      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(process);

      await expect(service.update(body)).rejects.toThrow(
        new HttpException(
          ErrorMessage.PROCESS_NOT_IN_MEDICAL_CONTROL.MSG + StageProcessesMessages[process.currentStageId],
          ErrorMessage.PROCESS_NOT_IN_MEDICAL_CONTROL.CODE,
        ),
      );
    });

    it('should throw an exception if the process is in pending approval return status', async () => {
      const body: MedicalControl = { processId: 1 } as MedicalControl;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.REVISION_DOCUMENTAL,
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
  });
});
