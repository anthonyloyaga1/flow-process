import { HttpException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';

import { RepositoryBase } from '../../../../shared/base-class/repository-base';
import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { TariffControl } from '../../../domain/rac/models/tariff-control';
import { ProcessEntity } from '../entities/process.entity';
import { TariffControlEntity } from '../entities/tariff_control.entity';

@Injectable()
export class TariffControlsRepository extends RepositoryBase<TariffControlEntity> {
  protected readonly entity = TariffControlEntity;

  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async findOneBasicById(id: number) {
    try {
      const entity = await this.getRepository().findOne({ where: { id, active: true } });
      return plainToInstance(TariffControl, entity);
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async findOneByProcessId(processId: number) {
    try {
      const entity = await this.getRepository().findOne({ where: { processId, active: true } });
      return plainToInstance(TariffControl, entity);
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async existTariffControlByProcessId(processId: number) {
    try {
      return await this.getRepository().exists({ where: { processId, active: true } });
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async transactionTariffControlProcessStatus(tariffControl: TariffControl, statusId: number) {
    const tariffControlEntity = this.getRepository().create(tariffControl);
    const processEntity = this.getDataSource().getRepository(ProcessEntity).create({ statusId });

    return await this.getDataSource()
      .transaction(async (manager) => {
        const documentReviewSaved = manager.save(TariffControlEntity, tariffControlEntity);
        manager.update(ProcessEntity, tariffControlEntity.processId, processEntity);
        return plainToInstance(TariffControl, documentReviewSaved);
      })
      .catch((error) => {
        throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
      });
  }
}
