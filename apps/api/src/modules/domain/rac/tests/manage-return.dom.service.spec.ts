import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { StatusProcessesEnum, StatusProcessMessages } from '../../../../shared/constants/processes';
import { ProcessesRepository } from '../../../infraestructure/database/repositories/processes.repository';
import { Process } from '../models/process';
import { ManageReturnsDomService } from '../../rac/services/manage-return.dom.service';

describe('ManageReturnsDomService', () => {
  let service: ManageReturnsDomService;
  let processesRepository: ProcessesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ManageReturnsDomService,
        {
          provide: ProcessesRepository,
          useValue: {
            findOneBasicById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ManageReturnsDomService>(ManageReturnsDomService);
    processesRepository = module.get<ProcessesRepository>(ProcessesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('manageProcessReturn', () => {
    it('should approve return to previous stage if status is APROBADO_RETORNO', async () => {
      const id = 1;
      const body: Partial<Process> = { statusId: StatusProcessesEnum.APROBADO_RETORNO, modifiedBy: 'user', rejected: true };

      const currentProcess: Process = {
        id: 1,
        caseNumber: '123',
        currentStageId: 1,
        returnStageId: 2,
        statusId: StatusProcessesEnum.PENDIENTE_APROBACION_RETORNO,
      } as Process;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(currentProcess);
      jest.spyOn(processesRepository, 'update').mockResolvedValue();

      const result = await service.manageProcessReturn(id, body);

      expect(processesRepository.findOneBasicById).toHaveBeenCalledWith(id);
      expect(processesRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: currentProcess.id,
          caseNumber: '123-R',
          currentStageId: 2,
          returnStageId: null,
          returnStageReason: null,
          statusId: StatusProcessesEnum.APROBADO_RETORNO,
          modifiedBy: body.modifiedBy,
        }),
      );
      expect(result).toEqual(
        expect.objectContaining({
          id: currentProcess.id,
          caseNumber: '123-R',
          currentStageId: 2,
          returnStageId: null,
          returnStageReason: null,
          statusId: StatusProcessesEnum.APROBADO_RETORNO,
          modifiedBy: body.modifiedBy,
        }),
      );
    });

    it('should reject return to previous stage if status is not APROBADO_RETORNO', async () => {
      const id = 1;
      const body: Partial<Process> = { statusId: StatusProcessesEnum.RECHAZADO_RETORNO, modifiedBy: 'user' };

      const currentProcess: Process = {
        id: 1,
        caseNumber: '123',
        currentStageId: 1,
        returnStageId: 2,
        statusId: StatusProcessesEnum.PENDIENTE_APROBACION_RETORNO,
      } as Process;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(currentProcess);
      jest.spyOn(processesRepository, 'update').mockResolvedValue();

      const result = await service.manageProcessReturn(id, body);

      expect(processesRepository.findOneBasicById).toHaveBeenCalledWith(id);
      expect(processesRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: currentProcess.id,
          returnStageId: null,
          returnStageReason: null,
          statusId: StatusProcessesEnum.RECHAZADO_RETORNO,
          modifiedBy: body.modifiedBy,
        }),
      );
      expect(result).toEqual(
        expect.objectContaining({
          id: currentProcess.id,
          returnStageId: null,
          returnStageReason: null,
          statusId: StatusProcessesEnum.RECHAZADO_RETORNO,
          modifiedBy: body.modifiedBy,
        }),
      );
    });

    it('should throw an exception if the process is not found', async () => {
      const id = 1;
      const body: Partial<Process> = { statusId: StatusProcessesEnum.APROBADO_RETORNO, modifiedBy: 'user' };

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(null);

      await expect(service.manageProcessReturn(id, body)).rejects.toThrow(
        new HttpException(ErrorMessage.PROCESS_NOT_FOUND.MSG, ErrorMessage.PROCESS_NOT_FOUND.CODE),
      );
    });

    it('should throw an exception if the process status is not PENDIENTE_APROBACION_RETORNO', async () => {
      const id = 1;
      const body: Partial<Process> = { statusId: StatusProcessesEnum.APROBADO_RETORNO, modifiedBy: 'user' };

      const currentProcess: Process = {
        id: 1,
        caseNumber: '123',
        currentStageId: 1,
        returnStageId: 2,
        statusId: StatusProcessesEnum.APROBADO_RETORNO,
      } as Process;

      jest.spyOn(processesRepository, 'findOneBasicById').mockResolvedValue(currentProcess);

      await expect(service.manageProcessReturn(id, body)).rejects.toThrow(
        new HttpException(
          ErrorMessage.PROCESS_NOT_ALLOWED_APPROVE_RETURN.MSG + StatusProcessMessages[currentProcess.statusId],
          ErrorMessage.PROCESS_NOT_ALLOWED_APPROVE_RETURN.CODE,
        ),
      );
    });
  });

  describe('appendReturnSuffix', () => {
    it('should append -R to caseNumber if rejected is true', () => {
      const currentProcess: Process = {
        caseNumber: '123',
      } as Process;

      const body: Process = {
        rejected: true,
      } as Process;

      const result = service['appendReturnSuffix'](currentProcess, body);
      expect(result).toBe('123-R');
    });

    it('should not append -R to caseNumber if rejected is false', () => {
      const currentProcess: Process = {
        caseNumber: '123',
      } as Process;

      const body: Process = {
        rejected: false,
      } as Process;

      const result = service['appendReturnSuffix'](currentProcess, body);
      expect(result).toBe('123');
    });
  });
});
