import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';

import { RepositoryBase } from '../../../../shared/base-class/repository-base';
import { ProviderGroup } from '../../../domain/common/models/provider-group';
import { ProviderGroupEntity } from '../entities/provider-group';

@Injectable()
export class ProviderGroupsRepository extends RepositoryBase<ProviderGroupEntity> {
  protected readonly entity = ProviderGroupEntity;

  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async findList() {
    const entities = await this.getRepository().find({
      where: { active: true },
      relations: { providerGroupAggregated: true },
    });
    return plainToInstance(ProviderGroup, entities);
  }
}
