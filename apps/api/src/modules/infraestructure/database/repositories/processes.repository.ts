import { HttpException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { DataSource, FindOptionsRelations, FindOptionsSelect } from 'typeorm';

import { RepositoryBase } from '../../../../shared/base-class/repository-base';
import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { convertSelectToObject, convertSelectToRelationsObject } from '../../../../shared/helpers/select-to-object.helper';
import { Process } from '../../../domain/rac/models/process';
import { ProcessEntity } from '../entities/process.entity';
import { processesPaginateConfig } from '../paging/processes.paginate';

@Injectable()
export class ProcessesRepository extends RepositoryBase<ProcessEntity> {
  protected readonly entity = ProcessEntity;

  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async findCollection(query: PaginateQuery) {
    try {
      const config = processesPaginateConfig(query.select);
      const collection = await paginate(query, this.getRepository(), config);
      return plainToInstance(Paginated<Process>, { ...collection });
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async findOneByIdSelectable(id: number, select?: string) {
    const selectDefault: FindOptionsSelect<ProcessEntity> = {};
    const relationsDefault: FindOptionsRelations<ProcessEntity> = {
      entryNumber: true,
      entryType: true,
      currentStage: true,
      returnStage: true,
      status: true,
      documentaryReview: true,
      medicalControl: true,
      tariffControl: true,
      budgetShipment: true,
      paymentShipment: true,
      curReview: { statusCur: true },
      provider: { providerGroup: { providerGroupAggregated: true } },
    };

    const selectObject = convertSelectToObject(select);
    const relationsObject = convertSelectToRelationsObject(select);

    const entity = await this.getRepository().findOne({
      where: { id, active: true },
      select: selectObject || selectDefault,
      relations: relationsObject || relationsDefault,
    });
    return plainToInstance(Process, entity);
  }

  async findOneById(id: number) {
    try {
      const entity = await this.getRepository().findOne({
        where: { id, active: true },
        relations: {
          entryNumber: true,
          entryType: true,
          currentStage: true,
          returnStage: true,
          status: true,
          documentaryReview: true,
          medicalControl: true,
          tariffControl: true,
          budgetShipment: true,
          paymentShipment: true,
          curReview: { statusCur: true },
          provider: { providerGroup: { providerGroupAggregated: true } },
        },
      });
      return plainToInstance(Process, entity);
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async findOneByCodigo(codigo: string) {
    try {
      const entity = await this.getRepository().findOne({
        where: { caseNumber: codigo, active: true },
        relations: {
          entryNumber: true,
          entryType: true,
          currentStage: true,
          returnStage: true,
          status: true,
          documentaryReview: true,
          medicalControl: true,
          tariffControl: true,
          budgetShipment: true,
          paymentShipment: true,
          curReview: { statusCur: true },
          provider: { providerGroup: { providerGroupAggregated: true } },
        },
      });
      return plainToInstance(Process, entity);
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async existProcessByCodigo(codigo: string) {
    try {
      return await this.getRepository().exists({ where: { caseNumber: codigo, active: true } });
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async findOneBasicById(id: number) {
    try {
      const entity = await this.getRepository().findOne({ where: { id, active: true } });
      return plainToInstance(Process, entity);
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }
}
