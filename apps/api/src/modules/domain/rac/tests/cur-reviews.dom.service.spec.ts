import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as dayjs from 'dayjs';

import { CurStatusEnum } from '../../../../shared/constants/cur-status.enum';
import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { StageProcessesEnum, StageProcessesMessages, StatusProcessesEnum, StatusProcessMessages } from '../../../../shared/constants/processes';
import { CurReviewsRepository } from '../../../infraestructure/database/repositories/cur-reviews.repository';
import { ProcessesRepository } from '../../../infraestructure/database/repositories/processes.repository';
import { Process } from '../models/process';
import { CurReview } from '../models/cur-review';
import { CurReviewsDomService } from '../services/cur-reviews.dom.service';

describe('CurReviewsDomService', () => {
  let service: CurReviewsDomService;
  let curReviewRepository: CurReviewsRepository;
  let processRepository: ProcessesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurReviewsDomService,
        {
          provide: CurReviewsRepository,
          useValue: {
            insert: jest.fn(),
            findOneBasicById: jest.fn(),
            findOneByProcessId: jest.fn(),
            existCurReviewByProcessId: jest.fn(),
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

    service = module.get<CurReviewsDomService>(CurReviewsDomService);
    curReviewRepository = module.get<CurReviewsRepository>(CurReviewsRepository);
    processRepository = module.get<ProcessesRepository>(ProcessesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a cur review', async () => {
      const body: CurReview = {
        processId: 1,
        curDate: dayjs().format('YYYY-MM-DD'),
        statusCurId: CurStatusEnum.PAID,
      } as CurReview;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.CUR_POR_DISPARAR,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
        currentStageDate: dayjs().subtract(1, 'day').toDate(),
      } as Process;

      jest.spyOn(processRepository, 'findOneBasicById').mockResolvedValue(process);
      jest.spyOn(curReviewRepository, 'existCurReviewByProcessId').mockResolvedValue(false);
      jest.spyOn(curReviewRepository, 'insert').mockResolvedValue(body);

      const result = await service.create(body);

      expect(result).toBe(body);
      expect(processRepository.findOneBasicById).toHaveBeenCalledWith(body.processId);
      expect(curReviewRepository.existCurReviewByProcessId).toHaveBeenCalledWith(body.processId);
      expect(curReviewRepository.insert).toHaveBeenCalledWith(body);
    });

    it('should throw an exception if the process does not exist', async () => {
      const body: CurReview = { processId: 1 } as CurReview;

      jest.spyOn(processRepository, 'findOneBasicById').mockResolvedValue(null);

      await expect(service.create(body)).rejects.toThrow(new HttpException(ErrorMessage.PROCESS_NOT_FOUND.MSG, ErrorMessage.PROCESS_NOT_FOUND.CODE));
    });

    it('should throw an exception if the process is in pending approval return status', async () => {
      const body: CurReview = { processId: 1 } as CurReview;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.CUR_POR_DISPARAR,
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

    it('should throw an exception if the process is not in cur review stage', async () => {
      const body: CurReview = { processId: 1 } as CurReview;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.REVISION_TARIFAS,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
      } as Process;

      jest.spyOn(processRepository, 'findOneBasicById').mockResolvedValue(process);

      await expect(service.create(body)).rejects.toThrow(
        new HttpException(
          ErrorMessage.PROCESS_NOT_IN_CUR_REV_STAGE.MSG + StageProcessesMessages[process.currentStageId],
          ErrorMessage.PROCESS_NOT_IN_CUR_REV_STAGE.CODE,
        ),
      );
    });

    it('should throw an exception if a cur review already exists for the process', async () => {
      const body: CurReview = { processId: 1 } as CurReview;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.CUR_POR_DISPARAR,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
      } as Process;

      jest.spyOn(processRepository, 'findOneBasicById').mockResolvedValue(process);
      jest.spyOn(curReviewRepository, 'existCurReviewByProcessId').mockResolvedValue(true);

      await expect(service.create(body)).rejects.toThrow(new HttpException(ErrorMessage.CUR_REV_EXIST.MSG, ErrorMessage.CUR_REV_EXIST.CODE));
    });

    it('should throw an exception if the cur review is in payment status', async () => {
      const body: CurReview = {
        processId: 1,
        statusCurId: CurStatusEnum.PENDING_ACCREDITATION,
      } as CurReview;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.CUR_POR_DISPARAR,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
      } as Process;

      jest.spyOn(processRepository, 'findOneBasicById').mockResolvedValue(process);

      await expect(service.create(body)).rejects.toThrow(
        new HttpException(ErrorMessage.PROCESS_CUR_REV_NOT_IN_PAYMENT_STATUS.MSG, ErrorMessage.PROCESS_CUR_REV_NOT_IN_PAYMENT_STATUS.CODE),
      );
    });

    it('should throw an exception if the cur date is out of range', async () => {
      const body: CurReview = {
        processId: 1,
        curDate: dayjs().subtract(31, 'day').format('YYYY-MM-DD'),
        statusCurId: CurStatusEnum.PAID,
      } as CurReview;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.CUR_POR_DISPARAR,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
        currentStageDate: dayjs().subtract(1, 'day').toDate(),
      } as Process;

      jest.spyOn(processRepository, 'findOneBasicById').mockResolvedValue(process);

      await expect(service.create(body)).rejects.toThrow(
        new HttpException(
          `${ErrorMessage.CUR_REV_DATE_RANGE_INVALID.MSG}. El campo curDate '${dayjs(body.curDate).format('YYYY-MM-DD')}' debe estar entre '${dayjs(process.currentStageDate).format('YYYY-MM-DD')}' y '${dayjs().format('YYYY-MM-DD')}'`,
          ErrorMessage.CUR_REV_DATE_RANGE_INVALID.CODE,
        ),
      );
    });
  });

  describe('findOneById', () => {
    it('should return a cur review by id', async () => {
      const curReview: CurReview = {
        id: 1,
        processId: 1,
      } as CurReview;

      jest.spyOn(curReviewRepository, 'findOneBasicById').mockResolvedValue(curReview);

      const result = await service.findOneById(1);

      expect(result).toBe(curReview);
      expect(curReviewRepository.findOneBasicById).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if the cur review is not found', async () => {
      jest.spyOn(curReviewRepository, 'findOneBasicById').mockResolvedValue(null);

      await expect(service.findOneById(1)).rejects.toThrow(
        new HttpException(ErrorMessage.CUR_REV_NOT_FOUND.MSG, ErrorMessage.CUR_REV_NOT_FOUND.CODE),
      );
    });
  });

  describe('findOneByProcessId', () => {
    it('should return a cur review by process id', async () => {
      const curReview: CurReview = {
        id: 1,
        processId: 1,
      } as CurReview;

      jest.spyOn(curReviewRepository, 'findOneByProcessId').mockResolvedValue(curReview);

      const result = await service.findOneByProcessId(1);

      expect(result).toBe(curReview);
      expect(curReviewRepository.findOneByProcessId).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if the cur review is not found', async () => {
      jest.spyOn(curReviewRepository, 'findOneByProcessId').mockResolvedValue(null);

      await expect(service.findOneByProcessId(1)).rejects.toThrow(
        new HttpException(ErrorMessage.CUR_REV_NOT_FOUND.MSG, ErrorMessage.CUR_REV_NOT_FOUND.CODE),
      );
    });
  });

  describe('update', () => {
    it('should update a cur review', async () => {
      const body: CurReview = {
        id: 1,
        processId: 1,
        curDate: dayjs().format('YYYY-MM-DD'),
        statusCurId: CurStatusEnum.PENDING_ACCREDITATION,
      } as CurReview;

      const curReview: CurReview = {
        id: 1,
        processId: 1,
        curDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        statusCurId: CurStatusEnum.PENDING_ACCREDITATION,
      } as CurReview;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.CUR_POR_DISPARAR,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
      } as Process;

      jest.spyOn(curReviewRepository, 'findOneBasicById').mockResolvedValue(curReview);
      jest.spyOn(processRepository, 'findOneBasicById').mockResolvedValue(process);
      jest.spyOn(curReviewRepository, 'update').mockResolvedValue();

      const result = await service.update(body);

      expect(result).toEqual(expect.objectContaining(body));
      expect(curReviewRepository.findOneBasicById).toHaveBeenCalledWith(body.id);
      expect(processRepository.findOneBasicById).toHaveBeenCalledWith(curReview.processId);
      expect(curReviewRepository.update).toHaveBeenCalledWith(expect.objectContaining(body));
    });

    it('should throw an exception if the cur review is not found', async () => {
      const body: CurReview = { id: 1 } as CurReview;

      jest.spyOn(curReviewRepository, 'findOneBasicById').mockResolvedValue(null);

      await expect(service.update(body)).rejects.toThrow(new HttpException(ErrorMessage.CUR_REV_NOT_FOUND.MSG, ErrorMessage.CUR_REV_NOT_FOUND.CODE));
    });

    it('should throw an exception if the process is not in cur review stage', async () => {
      const body: CurReview = { id: 1 } as CurReview;

      const curReview: CurReview = {
        id: 1,
        processId: 1,
      } as CurReview;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.REVISION_TARIFAS,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
      } as Process;

      jest.spyOn(curReviewRepository, 'findOneBasicById').mockResolvedValue(curReview);
      jest.spyOn(processRepository, 'findOneBasicById').mockResolvedValue(process);

      await expect(service.update(body)).rejects.toThrow(
        new HttpException(
          ErrorMessage.PROCESS_NOT_IN_CUR_REV_STAGE.MSG + StageProcessesMessages[process.currentStageId],
          ErrorMessage.PROCESS_NOT_IN_CUR_REV_STAGE.CODE,
        ),
      );
    });

    it('should throw an exception if the process is in pending approval return status', async () => {
      const body: CurReview = { id: 1 } as CurReview;

      const curReview: CurReview = {
        id: 1,
        processId: 1,
      } as CurReview;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.CUR_POR_DISPARAR,
        statusId: StatusProcessesEnum.PENDIENTE_APROBACION_RETORNO,
      } as Process;

      jest.spyOn(curReviewRepository, 'findOneBasicById').mockResolvedValue(curReview);
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
