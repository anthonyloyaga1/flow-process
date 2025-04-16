import { HttpException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';

import { RepositoryBase } from '../../../../shared/base-class/repository-base';
import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { ReportType } from '../../../domain/common/models/report-type';
import { ReportTypeEntity } from '../entities/report-type.entity';

@Injectable()
export class ReportTypesRepository extends RepositoryBase<ReportTypeEntity> {
  protected readonly entity = ReportTypeEntity;

  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async findOneBasicById(id: number) {
    try {
      const entity = await this.getRepository().findOne({ where: { id } });
      return plainToInstance(ReportType, entity);
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async findList() {
    try {
      const entities = await this.getRepository().find();
      return plainToInstance(ReportType, entities);
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }
}
