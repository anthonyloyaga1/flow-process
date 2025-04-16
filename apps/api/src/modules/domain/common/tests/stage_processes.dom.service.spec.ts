import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { StageProcessesRepository } from '../../../infraestructure/database/repositories/stage-processes.repository';
import { StageProcess } from '../models/stage-process';
import { StageProcessesDomService } from '../services/stage_processes.dom.service';

describe('StageProcessesDomService', () => {
  let service: StageProcessesDomService;
  let stageProcessesRepository: StageProcessesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StageProcessesDomService,
        {
          provide: StageProcessesRepository,
          useValue: {
            findOneBasicById: jest.fn(),
            findList: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StageProcessesDomService>(StageProcessesDomService);
    stageProcessesRepository = module.get<StageProcessesRepository>(StageProcessesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneById', () => {
    it('should return a stage process by id', async () => {
      const stageProcess: StageProcess = {
        id: 1,
        stageName: 'Stage 1',
      } as StageProcess;

      jest.spyOn(stageProcessesRepository, 'findOneBasicById').mockResolvedValue(stageProcess);

      const result = await service.findOneById(1);

      expect(result).toBe(stageProcess);
      expect(stageProcessesRepository.findOneBasicById).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if the stage process is not found', async () => {
      jest.spyOn(stageProcessesRepository, 'findOneBasicById').mockResolvedValue(null);

      await expect(service.findOneById(1)).rejects.toThrow(
        new HttpException(ErrorMessage.STATUS_PROCESS_NOT_FOUND.MSG, ErrorMessage.STATUS_PROCESS_NOT_FOUND.CODE),
      );
    });
  });

  describe('findList', () => {
    it('should return a list of stage processes', async () => {
      const stageProcesses: StageProcess[] = [
        { id: 1, stageName: 'Stage Process 1' } as StageProcess,
        { id: 2, stageName: 'Stage Process 2' } as StageProcess,
      ];

      jest.spyOn(stageProcessesRepository, 'findList').mockResolvedValue(stageProcesses);

      const result = await service.findList();

      expect(result).toBe(stageProcesses);
      expect(stageProcessesRepository.findList).toHaveBeenCalled();
    });

    it('should throw an exception if no stage processes are found', async () => {
      jest.spyOn(stageProcessesRepository, 'findList').mockResolvedValue(null);

      await expect(service.findList()).rejects.toThrow(
        new HttpException(ErrorMessage.STATUS_PROCESS_NOT_FOUND.MSG, ErrorMessage.STATUS_PROCESS_NOT_FOUND.CODE),
      );
    });
  });
});
