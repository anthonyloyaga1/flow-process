import { HttpException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';

import { RepositoryBase } from '../../../../shared/base-class/repository-base';
import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { MedicalControl } from '../../../domain/rac/models/medical-control';
import { MedicalControlEntity } from '../entities/medical-control.entity';
import { ProcessEntity } from '../entities/process.entity';

@Injectable()
export class MedicalControlsRepository extends RepositoryBase<MedicalControlEntity> {
  protected readonly entity = MedicalControlEntity;

  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async findOneBasicById(id: number) {
    try {
      const entity = await this.getRepository().findOne({ where: { id, active: true } });
      return plainToInstance(MedicalControl, entity);
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async findOneByProcessId(processId: number) {
    try {
      const entity = await this.getRepository().findOne({ where: { processId, active: true } });
      return plainToInstance(MedicalControl, entity);
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async existMedicalControlByProcessId(processId: number) {
    try {
      return await this.getRepository().exists({ where: { processId, active: true } });
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async transactionMedicalControlProcessStatus(medicalControl: MedicalControl, statusId: number) {
    const medicalControlEntity = this.getRepository().create(medicalControl);
    const processEntity = this.getDataSource().getRepository(ProcessEntity).create({ statusId });

    return await this.getDataSource()
      .transaction(async (manager) => {
        const documentReviewSaved = manager.save(MedicalControlEntity, medicalControlEntity);
        manager.update(ProcessEntity, medicalControlEntity.processId, processEntity);
        return plainToInstance(MedicalControl, documentReviewSaved);
      })
      .catch((error) => {
        throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
      });
  }
}
