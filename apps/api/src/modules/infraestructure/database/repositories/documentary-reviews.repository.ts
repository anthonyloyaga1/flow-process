import { HttpException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Process } from 'src/modules/domain/rac/models/process';
import { DataSource } from 'typeorm';

import { RepositoryBase } from '../../../../shared/base-class/repository-base';
import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { DocumentaryReview } from '../../../domain/rac/models/documentary-review';
import { DocumentaryReviewEntity } from '../entities/documentary-review.entity';
import { ProcessEntity } from '../entities/process.entity';

@Injectable()
export class DocumentaryReviewsRepository extends RepositoryBase<DocumentaryReviewEntity> {
  protected readonly entity = DocumentaryReviewEntity;

  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async findOneBasicById(id: number) {
    try {
      const entity = await this.getRepository().findOne({ where: { id, active: true } });
      return plainToInstance(DocumentaryReview, entity);
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async findOneByProcessId(processId: number) {
    try {
      const entity = await this.getRepository().findOne({ where: { processId, active: true } });
      return plainToInstance(DocumentaryReview, entity);
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async existDocumentaryReviewByProcessId(processId: number) {
    try {
      return await this.getRepository().exists({ where: { processId, active: true } });
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async transactionDocumentaryReviewReturnProcess(documentaryReview: DocumentaryReview, process: Partial<Process>) {
    const documentaryReviewEntity = this.getRepository().create({ ...documentaryReview, process: undefined });
    const processEntity = this.getDataSource()
      .getRepository(ProcessEntity)
      .create({ ...process, id: undefined });

    return await this.getDataSource()
      .transaction(async (manager) => {
        const documentReviewSaved = manager.save(DocumentaryReviewEntity, documentaryReviewEntity);
        manager.update(ProcessEntity, documentaryReviewEntity.processId, processEntity);
        return plainToInstance(DocumentaryReview, documentReviewSaved);
      })
      .catch((error) => {
        throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
      });
  }

  async transactionDocumentaryReviewProcessStatus(documentaryReview: DocumentaryReview, statusId: number) {
    const documentaryReviewEntity = this.getRepository().create(documentaryReview);
    const processEntity = this.getDataSource().getRepository(ProcessEntity).create({ statusId });

    return await this.getDataSource()
      .transaction(async (manager) => {
        const documentReviewSaved = manager.save(DocumentaryReviewEntity, documentaryReviewEntity);
        manager.update(ProcessEntity, documentaryReviewEntity.processId, processEntity);
        return plainToInstance(DocumentaryReview, documentReviewSaved);
      })
      .catch((error) => {
        throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
      });
  }
}
