import { HttpException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { DataSource } from 'typeorm';

import { RepositoryBase } from '../../../../shared/base-class/repository-base';
import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { CatalogDetail } from '../../../domain/common/models/catalog';
import { CatalogDetailEntity } from '../entities/catalog-detail.entity';
import { catalogDetailPaginateConfig } from '../paging/catalog-detail.paginate';

@Injectable()
export class CatalogDetailRepository extends RepositoryBase<CatalogDetailEntity> {
  protected readonly entity = CatalogDetailEntity;

  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async findCollection(query: PaginateQuery) {
    try {
      const config = catalogDetailPaginateConfig(query.select);
      return await paginate(query, this.getRepository(), config);
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async findOneById(id: number): Promise<CatalogDetail> {
    try {
      const entity = await this.getRepository().findOne({ where: { id } });
      return plainToInstance(CatalogDetail, entity);
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }
}
