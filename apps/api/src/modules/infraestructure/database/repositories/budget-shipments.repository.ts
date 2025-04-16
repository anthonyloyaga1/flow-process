import { HttpException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';

import { RepositoryBase } from '../../../../shared/base-class/repository-base';
import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { BudgetShipment } from '../../../domain/rac/models/budget-shipment';
import { BudgetShipmentEntity } from '../entities/budget-shipment.entity';
import { ProcessEntity } from '../entities/process.entity';

@Injectable()
export class BudgetShipmentsRepository extends RepositoryBase<BudgetShipmentEntity> {
  protected readonly entity = BudgetShipmentEntity;

  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async findOneBasicById(id: number) {
    try {
      const entity = await this.getRepository().findOne({ where: { id, active: true } });
      return plainToInstance(BudgetShipment, entity);
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async findOneByProcessId(processId: number) {
    try {
      const entity = await this.getRepository().findOne({ where: { processId, active: true } });
      return plainToInstance(BudgetShipment, entity);
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async existBudgetShipmentByProcessId(processId: number) {
    try {
      return await this.getRepository().exists({ where: { processId, active: true } });
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async transactionBudgetShipmentProcessStatus(budgetShipment: BudgetShipment, statusId: number) {
    const budgetShipmentEntity = this.getRepository().create(budgetShipment);
    const processEntity = this.getDataSource().getRepository(ProcessEntity).create({ statusId });

    return await this.getDataSource()
      .transaction(async (manager) => {
        const documentReviewSaved = manager.save(BudgetShipmentEntity, budgetShipmentEntity);
        manager.update(ProcessEntity, budgetShipmentEntity.processId, processEntity);
        return plainToInstance(BudgetShipment, documentReviewSaved);
      })
      .catch((error) => {
        throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
      });
  }
}
