import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as dayjs from 'dayjs';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { StageProcessesEnum, StageProcessesMessages, StatusProcessesEnum, StatusProcessMessages } from '../../../../shared/constants/processes';
import { DocumentaryReviewsRepository } from '../../../infraestructure/database/repositories/documentary-reviews.repository';
import { ProcessesRepository } from '../../../infraestructure/database/repositories/processes.repository';
import { Process } from '../models/process';
import { DocumentaryReview } from '../models/documentary-review';
import { DocumentaryReviewsDomService } from '../services/documentary-reviews.dom.service';

describe('DocumentaryReviewsDomService', () => {
  let service: DocumentaryReviewsDomService;
  let documentaryReviewsRepository: DocumentaryReviewsRepository;
  let processRepository: ProcessesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentaryReviewsDomService,
        {
          provide: DocumentaryReviewsRepository,
          useValue: {
            insert: jest.fn(),
            findOneById: jest.fn(),
            findOneBasicById: jest.fn(),
            findOneByProcessId: jest.fn(),
            existDocumentaryReviewByProcessId: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: ProcessesRepository,
          useValue: {
            findOneBasicById: jest.fn(),
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DocumentaryReviewsDomService>(DocumentaryReviewsDomService);
    documentaryReviewsRepository = module.get<DocumentaryReviewsRepository>(DocumentaryReviewsRepository);
    processRepository = module.get<ProcessesRepository>(ProcessesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a documentary review', async () => {
      const body: DocumentaryReview = {
        processId: 1,
        reviewDate: dayjs().format('YYYY-MM-DD'),
        filesDeliveryDate: dayjs().format('YYYY-MM-DD'),
      } as DocumentaryReview;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.REVISION_DOCUMENTAL,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
        currentStageDate: dayjs().subtract(1, 'day').toDate(),
      } as Process;

      jest.spyOn(processRepository, 'findOneById').mockResolvedValue(process);
      jest.spyOn(documentaryReviewsRepository, 'existDocumentaryReviewByProcessId').mockResolvedValue(false);
      jest.spyOn(documentaryReviewsRepository, 'insert').mockResolvedValue(body);

      const result = await service.create(body);

      expect(result).toBe(body);
      expect(processRepository.findOneById).toHaveBeenCalledWith(body.processId);
      expect(documentaryReviewsRepository.existDocumentaryReviewByProcessId).toHaveBeenCalledWith(body.processId);
      expect(documentaryReviewsRepository.insert).toHaveBeenCalledWith(body);
    });

    it('should throw an exception if the process does not exist', async () => {
      const body: DocumentaryReview = { processId: 1 } as DocumentaryReview;

      jest.spyOn(processRepository, 'findOneById').mockResolvedValue(null);

      await expect(service.create(body)).rejects.toThrow(new HttpException(ErrorMessage.PROCESS_NOT_FOUND.MSG, ErrorMessage.PROCESS_NOT_FOUND.CODE));
    });

    it('should throw an exception if the process is in pending approval return status', async () => {
      const body: DocumentaryReview = { processId: 1 } as DocumentaryReview;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.REVISION_DOCUMENTAL,
        statusId: StatusProcessesEnum.PENDIENTE_APROBACION_RETORNO,
      } as Process;

      jest.spyOn(processRepository, 'findOneById').mockResolvedValue(process);

      await expect(service.create(body)).rejects.toThrow(
        new HttpException(
          ErrorMessage.PROCESS_NOT_ALLOWED_APPROVE_RETURN.MSG + StatusProcessMessages[process.statusId],
          ErrorMessage.PROCESS_NOT_ALLOWED_APPROVE_RETURN.CODE,
        ),
      );
    });

    it('should throw an exception if the process is not in documentary review stage', async () => {
      const body: DocumentaryReview = { processId: 1 } as DocumentaryReview;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.CONTROL_TECNICO_MEDICO,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
      } as Process;

      jest.spyOn(processRepository, 'findOneById').mockResolvedValue(process);

      await expect(service.create(body)).rejects.toThrow(
        new HttpException(
          ErrorMessage.PROCESS_NOT_IN_DOCUMENTARY_REVIEW.MSG + StageProcessesMessages[process.currentStageId],
          ErrorMessage.PROCESS_NOT_IN_DOCUMENTARY_REVIEW.CODE,
        ),
      );
    });

    it('should throw an exception if a documentary review already exists for the process', async () => {
      const body: DocumentaryReview = { processId: 1 } as DocumentaryReview;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.REVISION_DOCUMENTAL,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
      } as Process;

      jest.spyOn(processRepository, 'findOneById').mockResolvedValue(process);
      jest.spyOn(documentaryReviewsRepository, 'existDocumentaryReviewByProcessId').mockResolvedValue(true);

      await expect(service.create(body)).rejects.toThrow(new HttpException(ErrorMessage.DOC_REV_EXIST.MSG, ErrorMessage.DOC_REV_EXIST.CODE));
    });

    it('should throw an exception if the review date is out of range', async () => {
      const body: DocumentaryReview = {
        processId: 1,
        reviewDate: dayjs().subtract(31, 'day').format('YYYY-MM-DD'),
        filesDeliveryDate: dayjs().format('YYYY-MM-DD'),
      } as DocumentaryReview;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.REVISION_DOCUMENTAL,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
        currentStageDate: dayjs().subtract(1, 'day').toDate(),
      } as Process;

      jest.spyOn(processRepository, 'findOneById').mockResolvedValue(process);

      await expect(service.create(body)).rejects.toThrow(
        new HttpException(
          `${ErrorMessage.DOC_REV_DATE_INVALID.MSG}. El campo reviewDate '${dayjs(body.reviewDate).format('YYYY-MM-DD')}' debe estar entre '${dayjs(process.currentStageDate).format('YYYY-MM-DD')}' y '${dayjs().format('YYYY-MM-DD')}'`,
          ErrorMessage.DOC_REV_DATE_INVALID.CODE,
        ),
      );
    });

    it('should throw an exception if the review date delay is greater than 10 days', async () => {
      const body: DocumentaryReview = {
        processId: 1,
        reviewDate: dayjs().subtract(10, 'day').format('YYYY-MM-DD'),
        filesDeliveryDate: dayjs().format('YYYY-MM-DD'),
      } as DocumentaryReview;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.REVISION_DOCUMENTAL,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
        currentStageDate: dayjs().subtract(21, 'day').toDate(),
      } as Process;

      jest.spyOn(processRepository, 'findOneById').mockResolvedValue(process);

      await expect(service.create(body)).rejects.toThrow(
        new HttpException(ErrorMessage.DOC_REV_DELAY_REASON_REQUIRED.MSG, ErrorMessage.DOC_REV_DELAY_REASON_REQUIRED.CODE),
      );
    });

    it('should throw an exception if the files delivery date is out of range', async () => {
      const body: DocumentaryReview = {
        processId: 1,
        reviewDate: dayjs().format('YYYY-MM-DD'),
        filesDeliveryDate: dayjs().subtract(31, 'day').format('YYYY-MM-DD'),
      } as DocumentaryReview;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.REVISION_DOCUMENTAL,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
        currentStageDate: dayjs().subtract(1, 'day').toDate(),
      } as Process;

      jest.spyOn(processRepository, 'findOneById').mockResolvedValue(process);

      await expect(service.create(body)).rejects.toThrow(
        new HttpException(
          `${ErrorMessage.DOC_REV_FILES_DELIVERY_DATE_INVALID.MSG}. El campo filesDeliveryDate '${dayjs(body.filesDeliveryDate).format('YYYY-MM-DD')}' debe estar entre '${dayjs(process.currentStageDate).format('YYYY-MM-DD')}' y '${dayjs().format('YYYY-MM-DD')}'`,
          ErrorMessage.DOC_REV_FILES_DELIVERY_DATE_INVALID.CODE,
        ),
      );
    });
  });

  describe('findOneById', () => {
    it('should return a documentary review by id', async () => {
      const documentaryReview: DocumentaryReview = {
        id: 1,
        processId: 1,
      } as DocumentaryReview;

      jest.spyOn(documentaryReviewsRepository, 'findOneBasicById').mockResolvedValue(documentaryReview);

      const result = await service.findOneById(1);

      expect(result).toBe(documentaryReview);
      expect(documentaryReviewsRepository.findOneBasicById).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if the documentary review is not found', async () => {
      jest.spyOn(documentaryReviewsRepository, 'findOneBasicById').mockResolvedValue(null);

      await expect(service.findOneById(1)).rejects.toThrow(
        new HttpException(ErrorMessage.DOC_REV_NOT_FOUND.MSG, ErrorMessage.DOC_REV_NOT_FOUND.CODE),
      );
    });
  });

  describe('findOneByProcessId', () => {
    it('should return a documentary review by process id', async () => {
      const documentaryReview: DocumentaryReview = {
        id: 1,
        processId: 1,
      } as DocumentaryReview;

      jest.spyOn(documentaryReviewsRepository, 'findOneByProcessId').mockResolvedValue(documentaryReview);

      const result = await service.findOneByProcessId(1);

      expect(result).toBe(documentaryReview);
      expect(documentaryReviewsRepository.findOneByProcessId).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if the documentary review is not found', async () => {
      jest.spyOn(documentaryReviewsRepository, 'findOneByProcessId').mockResolvedValue(null);

      await expect(service.findOneByProcessId(1)).rejects.toThrow(
        new HttpException(ErrorMessage.DOC_REV_NOT_FOUND.MSG, ErrorMessage.DOC_REV_NOT_FOUND.CODE),
      );
    });
  });

  describe('update', () => {
    it('should update a documentary review', async () => {
      const body: DocumentaryReview = {
        id: 1,
        processId: 1,
        reviewDate: dayjs().format('YYYY-MM-DD'),
        filesDeliveryDate: dayjs().format('YYYY-MM-DD'),
        secondReviewDate: dayjs().format('YYYY-MM-DD'),
      } as DocumentaryReview;

      const documentaryReview: DocumentaryReview = {
        id: 1,
        processId: 1,
        reviewDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        filesDeliveryDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      } as DocumentaryReview;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.REVISION_DOCUMENTAL,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
      } as Process;

      jest.spyOn(documentaryReviewsRepository, 'findOneBasicById').mockResolvedValue(documentaryReview);
      jest.spyOn(processRepository, 'findOneById').mockResolvedValue(process);
      jest.spyOn(documentaryReviewsRepository, 'update').mockResolvedValue();

      const result = await service.update(body);

      expect(result).toEqual(expect.objectContaining(body));
      expect(documentaryReviewsRepository.findOneBasicById).toHaveBeenCalledWith(body.id);
      expect(processRepository.findOneById).toHaveBeenCalledWith(documentaryReview.processId);
      expect(documentaryReviewsRepository.update).toHaveBeenCalledWith(expect.objectContaining(body));
    });

    it('should throw an exception if the documentary review is not found', async () => {
      const body: DocumentaryReview = { id: 1 } as DocumentaryReview;

      jest.spyOn(documentaryReviewsRepository, 'findOneBasicById').mockResolvedValue(null);

      await expect(service.update(body)).rejects.toThrow(new HttpException(ErrorMessage.DOC_REV_NOT_FOUND.MSG, ErrorMessage.DOC_REV_NOT_FOUND.CODE));
    });

    it('should throw an exception if the process is not in documentary review stage', async () => {
      const body: DocumentaryReview = { id: 1 } as DocumentaryReview;

      const documentaryReview: DocumentaryReview = {
        id: 1,
        processId: 1,
      } as DocumentaryReview;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.CUR_POR_DISPARAR,
        statusId: StatusProcessesEnum.PENDIENTE_REVISION,
      } as Process;

      jest.spyOn(documentaryReviewsRepository, 'findOneBasicById').mockResolvedValue(documentaryReview);
      jest.spyOn(processRepository, 'findOneById').mockResolvedValue(process);

      await expect(service.update(body)).rejects.toThrow(
        new HttpException(
          ErrorMessage.PROCESS_NOT_IN_DOCUMENTARY_REVIEW.MSG + StageProcessesMessages[process.currentStageId],
          ErrorMessage.PROCESS_NOT_IN_DOCUMENTARY_REVIEW.CODE,
        ),
      );
    });

    it('should throw an exception if the second review date is out of range', async () => {
      const body: DocumentaryReview = {
        id: 1,
        processId: 1,
        secondReviewDate: dayjs().add(1, 'month').endOf('month').add(1, 'day').format('YYYY-MM-DD'),
      } as DocumentaryReview;

      const documentaryReview: DocumentaryReview = {
        id: 1,
        processId: 1,
        reviewDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        filesDeliveryDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      } as DocumentaryReview;

      const process: Process = {
        id: 1,
        currentStageId: StageProcessesEnum.REVISION_DOCUMENTAL,
        statusId: StatusProcessesEnum.APROBADO_RETORNO,
        receptionDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        rejected: true,
      } as Process;

      jest.spyOn(documentaryReviewsRepository, 'findOneBasicById').mockResolvedValue(documentaryReview);
      jest.spyOn(processRepository, 'findOneById').mockResolvedValue(process);

      const firstDayOfNextMonth = dayjs(documentaryReview.reviewDate).add(1, 'month').startOf('month');
      const lastDayOfNextMonth = dayjs(documentaryReview.reviewDate).add(1, 'month').endOf('month');

      await expect(service.update(body)).rejects.toThrow(
        new HttpException(
          `${ErrorMessage.DOC_REV_SECOND_REVIEW_DATE_INVALID.MSG}. El campo secondReviewDate '${dayjs(body.secondReviewDate).format('YYYY-MM-DD')}' debe estar entre '${dayjs(firstDayOfNextMonth).add(1, 'day').format('YYYY-MM-DD')}' y '${dayjs(lastDayOfNextMonth).add(1, 'month').format('YYYY-MM-DD')}'`,
          ErrorMessage.DOC_REV_SECOND_REVIEW_DATE_INVALID.CODE,
        ),
      );
    });
  });
});
