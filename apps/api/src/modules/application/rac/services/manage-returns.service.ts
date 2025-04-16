import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { Metadata } from '../../../../shared/base-class/payload-base';
import { ManageReturnsDomService } from '../../../domain/rac/services/manage-return.dom.service';
import { Process } from '../../../domain/rac/models/process';
import { ProcessBasicDto } from '../dto/process.dto';
import { UpdateManageReturnToPreviousStageDto } from '../dto/update-manage-return.dto';

@Injectable()
export class ManageReturnsService {
  constructor(private readonly processesDomService: ManageReturnsDomService) {}

  /**
   * Gestionar la solicitud de retorno a la etapa anterior
   * CU_009
   *
   * @async
   * @param {number} id
   * @param {UpdateManageReturnToPreviousStageDto} body
   * @param {Metadata} metadata
   * @returns {Promise<ProcessBasicDto>}
   */
  async manageReturnToPreviousStage(id: number, body: UpdateManageReturnToPreviousStageDto, metadata: Metadata): Promise<ProcessBasicDto> {
    const process = plainToInstance(Process, { ...body, id });
    process.modifiedBy = metadata.user.preferred_username;
    const processEdited = this.processesDomService.manageProcessReturn(id, body);
    return plainToInstance(ProcessBasicDto, processEdited, { excludeExtraneousValues: true });
  }
}
