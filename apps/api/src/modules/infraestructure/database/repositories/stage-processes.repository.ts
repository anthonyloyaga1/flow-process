import { HttpException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';

import { RepositoryBase } from '../../../../shared/base-class/repository-base';
import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { StageProcess } from '../../../domain/common/models/stage-process';
import { StageProcessEntity } from '../entities/stage_process.entity';

@Injectable()
export class StageProcessesRepository extends RepositoryBase<StageProcessEntity> {
  protected readonly entity = StageProcessEntity;

  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async findOneBasicById(id: number) {
    try {
      const entity = await this.getRepository().findOne({ where: { id } });
      return plainToInstance(StageProcess, entity);
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async findList() {
    try {
      const entities = await this.getRepository().find();
      return plainToInstance(StageProcess, entities);
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }
}
