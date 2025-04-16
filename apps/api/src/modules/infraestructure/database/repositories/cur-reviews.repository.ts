import { HttpException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';

import { RepositoryBase } from '../../../../shared/base-class/repository-base';
import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { CurReview } from '../../../domain/rac/models/cur-review';
import { CurReviewEntity } from '../entities/cur-review.entity';
import { ProcessEntity } from '../entities/process.entity';

@Injectable()
export class CurReviewsRepository extends RepositoryBase<CurReviewEntity> {
  protected readonly entity = CurReviewEntity;

  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async findOneBasicById(id: number) {
    try {
      const entity = await this.getRepository().findOne({ where: { id, active: true } });
      return plainToInstance(CurReview, entity);
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async findOneByProcessId(processId: number) {
    try {
      const entity = await this.getRepository().findOne({ where: { processId, active: true } });
      return plainToInstance(CurReview, entity);
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async existCurReviewByProcessId(processId: number) {
    try {
      return await this.getRepository().exists({ where: { processId, active: true } });
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async transactionCurReviewProcessStatus(curReview: CurReview, statusId: number) {
    const curReviewEntity = this.getRepository().create(curReview);
    const processEntity = this.getDataSource().getRepository(ProcessEntity).create({ statusId });

    return await this.getDataSource()
      .transaction(async (manager) => {
        const documentReviewSaved = manager.save(CurReviewEntity, curReviewEntity);
        manager.update(ProcessEntity, curReviewEntity.processId, processEntity);
        return plainToInstance(CurReview, documentReviewSaved);
      })
      .catch((error) => {
        throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
      });
  }
}
