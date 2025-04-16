import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as dayjs from 'dayjs';
import { Paginated, PaginateQuery } from 'nestjs-paginate';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { StageProcessesEnum, StatusProcessesEnum } from '../../../../shared/constants/processes';
import { ProcessesRepository } from '../../../infraestructure/database/repositories/processes.repository';
import { Process } from '../models/process';
import { ProcessesDomService } from '../services/processes.dom.service';

describe('ProcessesDomService', () => {
  let service: ProcessesDomService;
  let processesRepository: ProcessesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessesDomService,
        {
          provide: ProcessesRepository,
          useValue: {
            insert: jest.fn(),
            findCollection: jest.fn(),
            findOneById: jest.fn(),
            findOneByIdSelectable: jest.fn(),
            findOneBasicById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProcessesDomService>(ProcessesDomService);
    processesRepository = module.get<ProcessesRepository>(ProcessesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a process', async () => {
      const body: Process = {
        currentStageId: StageProcessesEnum.RECEPCION_DOCUMENTAL,
        currentStageDate: new Date(),
        statusId: StatusProcessesEnum.GUARDADO_BORRADOR,
      } as Process;

      const processSaved = { id: 1, ...body } as Process;

      jest.spyOn(processesRepository, 'insert').mockResolvedValue(processSaved);
      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(processSaved);

      const result = await service.create(body);

      expect(result).toBe(processSaved);
      expect(processesRepository.insert).toHaveBeenCalledWith(body);
      expect(processesRepository.findOneBasicById).toHaveBeenCalledWith(processSaved.id);
    });
  });

  describe('findCollection', () => {
    it('should return a paginated collection of processes', async () => {
      const query: PaginateQuery = {} as PaginateQuery;
      const paginatedResult: Paginated<Process> = {
        data: [
          {
            id: 1,
            currentStageId: StageProcessesEnum.RECEPCION_DOCUMENTAL,
            currentStageDate: new Date(),
            statusId: StatusProcessesEnum.GUARDADO_BORRADOR,
          } as Process,
        ],
        meta: { currentPage: 1, itemsPerPage: 1, totalItems: 1, totalPages: 1 },
      } as Paginated<Process>;

      jest.spyOn(processesRepository, 'findCollection').mockResolvedValue(paginatedResult);

      const result = await service.findCollection(query);

      expect(result).toBe(paginatedResult);
      expect(processesRepository.findCollection).toHaveBeenCalledWith(query);
    });
  });

  describe('findOneById', () => {
    it('should return a process by id', async () => {
      const process: Process = { id: 1 } as Process;

      jest.spyOn(processesRepository, 'findOneById').mockResolvedValue(process);

      const result = await service.findOneById(1);

      expect(result).toBe(process);
      expect(processesRepository.findOneById).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if the process is not found', async () => {
      jest.spyOn(processesRepository, 'findOneById').mockResolvedValue(null);

      await expect(service.findOneById(1)).rejects.toThrow(
        new HttpException(ErrorMessage.PROCESS_NOT_FOUND.MSG, ErrorMessage.PROCESS_NOT_FOUND.CODE),
      );
    });
  });

  describe('findOneByIdSelectable', () => {
    it('should return a process by id with selectable fields', async () => {
      const process: Process = { id: 1 } as Process;
      const select = 'id,caseNumber';

      jest.spyOn(processesRepository, 'findOneByIdSelectable').mockResolvedValue(process);

      const result = await service.findOneByIdSelectable(1, select);

      expect(result).toBe(process);
      expect(processesRepository.findOneByIdSelectable).toHaveBeenCalledWith(1, select);
    });

    it('should throw an exception if the process is not found', async () => {
      jest.spyOn(processesRepository, 'findOneByIdSelectable').mockResolvedValue(null);

      await expect(service.findOneByIdSelectable(1)).rejects.toThrow(
        new HttpException(ErrorMessage.PROCESS_NOT_FOUND.MSG, ErrorMessage.PROCESS_NOT_FOUND.CODE),
      );
    });
  });

  describe('update', () => {
    it('should update a process', async () => {
      const body: Process = { id: 1, observations: 'Observation v1' } as Process;
      const process: Process = { id: 1, observations: 'Observation v2' } as Process;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(process);
      jest.spyOn(processesRepository, 'update').mockResolvedValue();

      const result = await service.update(body);

      expect(result).toEqual(expect.objectContaining(body));
      expect(processesRepository.findOneBasicById).toHaveBeenCalledWith(body.id);
      expect(processesRepository.update).toHaveBeenCalledWith(expect.objectContaining(body));
    });

    it('should not update because is the same data', async () => {
      const body: Process = { id: 1, observations: 'Observation v1' } as Process;
      const process: Process = { id: 1, observations: 'Observation v1' } as Process;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(process);

      const result = await service.update(body);

      expect(result).toEqual(process);
      expect(processesRepository.findOneBasicById).toHaveBeenCalledWith(body.id);
    });

    it('should throw an exception if the process is not found', async () => {
      const body: Process = { id: 1 } as Process;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(null);

      await expect(service.update(body)).rejects.toThrow(new HttpException(ErrorMessage.PROCESS_NOT_FOUND.MSG, ErrorMessage.PROCESS_NOT_FOUND.CODE));
    });

    it('should throw an exception if the second review date is out of range', async () => {
      const body: Process = { id: 1, secondReceptionDate: dayjs().add(1, 'month').endOf('month').add(1, 'day').format('YYYY-MM-DD') } as Process;
      const process: Process = { id: 1, receptionDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'), rejected: true } as Process;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(process);

      const firstDayOfNextMonth = dayjs(process.receptionDate).add(1, 'month').startOf('month');
      const lastDayOfNextMonth = dayjs(process.receptionDate).add(1, 'month').endOf('month');

      await expect(service.update(body)).rejects.toThrow(
        new HttpException(
          `${ErrorMessage.PROCESS_SECOND_RECEPTION_DATE_INVALID.MSG}. El campo secondReceptionDate '${dayjs(body.secondReceptionDate).format('YYYY-MM-DD')}' debe estar entre '${dayjs(firstDayOfNextMonth).add(1, 'day').format('YYYY-MM-DD')}' y '${dayjs(lastDayOfNextMonth).add(1, 'month').format('YYYY-MM-DD')}'`,
          ErrorMessage.PROCESS_SECOND_RECEPTION_DATE_INVALID.CODE,
        ),
      );
    });
  });

  describe('softRemove', () => {
    it('should soft remove a process', async () => {
      const process: Process = { id: 1, statusId: StatusProcessesEnum.GUARDADO_BORRADOR } as Process;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(process);
      jest.spyOn(processesRepository, 'update').mockResolvedValue();

      const result = await service.softRemove(1, 'user');

      expect(result).toBe('Dato eliminado correctamente');
      expect(processesRepository.findOneBasicById).toHaveBeenCalledWith(1);
      expect(processesRepository.update).toHaveBeenCalledWith(expect.objectContaining({ active: false, modifiedBy: 'user' }));
    });

    it('should throw an exception if the process is not found', async () => {
      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(null);

      await expect(service.softRemove(1, 'user')).rejects.toThrow(
        new HttpException(ErrorMessage.PROCESS_NOT_FOUND.MSG, ErrorMessage.PROCESS_NOT_FOUND.CODE),
      );
    });
  });

  describe('sendNextStage', () => {
    it('should send a process to the next stage', async () => {
      const currentProcess: Process = {
        id: 1,
        currentStage: { nextStageId: StageProcessesEnum.REVISION_DOCUMENTAL },
        currentStageId: StageProcessesEnum.RECEPCION_DOCUMENTAL,
      } as Process;

      jest.spyOn(processesRepository, 'findOneById').mockResolvedValue(currentProcess);
      jest.spyOn(processesRepository, 'update').mockResolvedValue();

      const result = await service.sendNextStage(1, 'user');

      expect(result).toEqual(expect.objectContaining({ currentStageId: StageProcessesEnum.REVISION_DOCUMENTAL }));
      expect(processesRepository.findOneById).toHaveBeenCalledWith(1);
      expect(processesRepository.update).toHaveBeenCalledWith(expect.objectContaining({ currentStageId: StageProcessesEnum.REVISION_DOCUMENTAL }));
    });

    it('should throw an exception if the process is not found', async () => {
      jest.spyOn(processesRepository, 'findOneById').mockResolvedValue(null);

      await expect(service.sendNextStage(1, 'user')).rejects.toThrow(
        new HttpException(ErrorMessage.PROCESS_NOT_FOUND.MSG, ErrorMessage.PROCESS_NOT_FOUND.CODE),
      );
    });

    it('should throw an exception if the process has no next stage', async () => {
      const currentProcess: Process = {
        id: 1,
        currentStage: { nextStageId: null },
      } as Process;

      jest.spyOn(processesRepository, 'findOneById').mockResolvedValue(currentProcess);

      await expect(service.sendNextStage(1, 'user')).rejects.toThrow(
        new HttpException(ErrorMessage.PROCESS_NOT_NEXT_STAGE.MSG, ErrorMessage.PROCESS_NOT_NEXT_STAGE.CODE),
      );
    });
  });

  describe('sendToPreviousStage', () => {
    it('should send a process to the previous stage', async () => {
      const body: Process = {
        id: 1,
        returnStageId: StageProcessesEnum.RECEPCION_DOCUMENTAL,
        returnStageReason: 'reason',
        modifiedBy: 'user',
      } as Process;
      const currentProcess: Process = {
        id: 1,
        currentStage: { id: StageProcessesEnum.REVISION_DOCUMENTAL, allowedReturnStage: [1] },
        currentStageId: StageProcessesEnum.REVISION_DOCUMENTAL,
      } as Process;

      jest.spyOn(processesRepository, 'findOneById').mockResolvedValue(currentProcess);
      jest.spyOn(processesRepository, 'update').mockResolvedValue();

      const result = await service.sendToPreviousStage(body);

      expect(result).toEqual(expect.objectContaining({ returnStageId: StageProcessesEnum.RECEPCION_DOCUMENTAL }));
      expect(processesRepository.findOneById).toHaveBeenCalledWith(body.id);
      expect(processesRepository.update).toHaveBeenCalledWith(expect.objectContaining({ returnStageId: StageProcessesEnum.RECEPCION_DOCUMENTAL }));
    });

    it('should throw an exception if the process is not found', async () => {
      const body: Process = { id: 1 } as Process;

      jest.spyOn(processesRepository, 'findOneById').mockResolvedValue(null);

      await expect(service.sendToPreviousStage(body)).rejects.toThrow(
        new HttpException(ErrorMessage.PROCESS_NOT_FOUND.MSG, ErrorMessage.PROCESS_NOT_FOUND.CODE),
      );
    });

    it('should throw an exception if the current stage is the same as the return stage', async () => {
      const body: Process = {
        id: 1,
        returnStageId: StageProcessesEnum.REVISION_DOCUMENTAL,
        returnStageReason: 'Reason',
        modifiedBy: 'user',
        rejected: false,
      } as Process;

      const currentProcess: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.REVISION_DOCUMENTAL,
        currentStage: { id: StageProcessesEnum.REVISION_DOCUMENTAL },
      } as Process;

      jest.spyOn(processesRepository, 'findOneById').mockResolvedValue(currentProcess);

      await expect(service.sendToPreviousStage(body)).rejects.toThrow(
        new HttpException(ErrorMessage.PROCESS_SAME_STAGE.MSG, ErrorMessage.PROCESS_SAME_STAGE.CODE),
      );
    });

    it('should throw an exception if the return stage is not allowed', async () => {
      const body: Process = {
        id: 1,
        returnStageId: StageProcessesEnum.RECEPCION_DOCUMENTAL,
        returnStageReason: 'Reason',
        modifiedBy: 'user',
        rejected: false,
      } as Process;

      const currentProcess: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.REVISION_DOCUMENTAL,
        currentStage: { id: StageProcessesEnum.REVISION_DOCUMENTAL, allowedReturnStage: [] },
      } as Process;

      jest.spyOn(processesRepository, 'findOneById').mockResolvedValue(currentProcess);

      await expect(service.sendToPreviousStage(body)).rejects.toThrow(
        new HttpException(ErrorMessage.PROCESS_NOT_ALLOWED_RETURN_STAGE.MSG, ErrorMessage.PROCESS_NOT_ALLOWED_RETURN_STAGE.CODE),
      );
    });

    it('should throw an exception if the process is already rejected and sent to documentary reception', async () => {
      const body: Process = {
        id: 1,
        returnStageId: StageProcessesEnum.RECEPCION_DOCUMENTAL,
        returnStageReason: 'Reason',
        modifiedBy: 'user',
        rejected: true,
      } as Process;

      const currentProcess: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.REVISION_DOCUMENTAL,
        currentStage: { id: StageProcessesEnum.REVISION_DOCUMENTAL, allowedReturnStage: [1] },
        rejected: true,
      } as Process;

      jest.spyOn(processesRepository, 'findOneById').mockResolvedValue(currentProcess);

      await expect(service.sendToPreviousStage(body)).rejects.toThrow(
        new HttpException(ErrorMessage.PROCESS_ALREADY_REJECTED.MSG, ErrorMessage.PROCESS_ALREADY_REJECTED.CODE),
      );
    });
  });
});
