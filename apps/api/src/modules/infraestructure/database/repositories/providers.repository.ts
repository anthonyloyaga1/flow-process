import { HttpException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { DataSource } from 'typeorm';

import { RepositoryBase } from '../../../../shared/base-class/repository-base';
import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { Provider } from '../../../domain/rac/models/provider';
import { ProviderEntity } from '../entities/provider.entity';
import { providersPaginateConfig } from '../paging/providers.paginate';

@Injectable()
export class ProvidersRepository extends RepositoryBase<ProviderEntity> {
  protected readonly entity = ProviderEntity;

  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async findOneById(id: number) {
    try {
      const entity = await this.getRepository().findOne({
        where: { id, active: true },
        relations: { providerGroup: true },
      });
      return plainToInstance(Provider, entity);
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async findOneByUnicode(unicode: number) {
    try {
      const entity = await this.getRepository().findOne({
        where: { unicode, active: true },
        relations: { providerGroup: true },
      });
      return plainToInstance(Provider, entity);
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async findCollection(query: PaginateQuery) {
    try {
      const config = providersPaginateConfig(query.select);
      const collection = await paginate(query, this.getRepository(), config).catch();
      return plainToInstance(Paginated<Provider>, { ...collection });
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }
}
