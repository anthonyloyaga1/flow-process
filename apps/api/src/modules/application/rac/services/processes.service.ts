import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PaginateQuery } from 'nestjs-paginate';

import { Metadata } from '../../../../shared/base-class/payload-base';
import { getUserInitials } from '../../../../shared/helpers/user-initials';
import { Process } from '../../../domain/rac/models/process';
import { ProcessesDomService } from '../../../domain/rac/services/processes.dom.service';
import { CreateProcessDto } from '../dto/create-process.dto';
import { ProcessBasicDto, ProcessDto } from '../dto/process.dto';
import { UpdateProcessDto, UpdateRestoreStageProcessDto } from '../dto/update-process.dto';

@Injectable()
export class ProcessesService {
  constructor(private readonly processesDomService: ProcessesDomService) {}

  async create(body: CreateProcessDto, metadata: Metadata): Promise<ProcessBasicDto> {
    const process = plainToInstance(Process, body);

    //* CU02_RN01 Iniciales del usuario que crea el proceso
    process.createdBy = metadata.user.preferred_username;
    process.createdByUserInitials = getUserInitials(metadata.user.name);
    process.createdByName = metadata.user.name;
    const processSaved = this.processesDomService.create(process);

    return plainToInstance(ProcessBasicDto, processSaved, { excludeExtraneousValues: true });
  }

  async findCollection(query: PaginateQuery) {
    const collection = await this.processesDomService.findCollection(query);
    const mappedCollection = plainToInstance(ProcessDto, collection.data, { excludeExtraneousValues: true });
    return { collection: mappedCollection, meta: collection.meta, links: collection.links };
  }

  async findOneById(id: number): Promise<ProcessDto> {
    const process = await this.processesDomService.findOneById(id);
    return plainToInstance(ProcessDto, process, { excludeExtraneousValues: true });
  }

  async findOneByIdSelectable(id: number, select: string): Promise<ProcessDto> {
    const process = await this.processesDomService.findOneByIdSelectable(id, select);
    return plainToInstance(ProcessDto, process, { excludeExtraneousValues: true });
  }

  async update(id: number, body: UpdateProcessDto, metadata: Metadata): Promise<ProcessBasicDto> {
    const process = plainToInstance(Process, { ...body, id });
    process.modifiedBy = metadata.user.preferred_username;

    const processEdited = this.processesDomService.update(process);

    return plainToInstance(ProcessBasicDto, processEdited, { excludeExtraneousValues: true });
  }

  async remove(id: number, metadata: Metadata): Promise<string> {
    const modifiedBy = metadata.user.preferred_username;

    return await this.processesDomService.softRemove(id, modifiedBy);
  }

  async sendNextStage(id: number, metadata: Metadata): Promise<ProcessBasicDto> {
    const modifiedBy = metadata.user.preferred_username;
    const processEdited = this.processesDomService.sendNextStage(id, modifiedBy);
    return plainToInstance(ProcessBasicDto, processEdited, { excludeExtraneousValues: true });
  }

  async sendToPreviousStage(id: number, body: UpdateRestoreStageProcessDto, metadata: Metadata): Promise<ProcessBasicDto> {
    const process = plainToInstance(Process, { ...body, id });
    process.modifiedBy = metadata.user.preferred_username;
    process.returnStageByName = metadata.user.name;
    process.returnStageBy = metadata.user.preferred_username;
    const processEdited = this.processesDomService.sendToPreviousStage(process);
    return plainToInstance(ProcessBasicDto, processEdited, { excludeExtraneousValues: true });
  }
}
