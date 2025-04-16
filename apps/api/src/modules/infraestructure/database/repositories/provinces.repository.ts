import { HttpException, Injectable } from '@nestjs/common';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { DataSource } from 'typeorm';

import { RepositoryBase } from '../../../../shared/base-class/repository-base';
import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { ProvinceEntity } from '../entities/province.entity';
import { provincesPaginateConfig } from '../paging/provinces.paginate';

@Injectable()
export class ProvinciesRepository extends RepositoryBase<ProvinceEntity> {
  protected readonly entity = ProvinceEntity;

  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async findCollection(query: PaginateQuery) {
    const config = provincesPaginateConfig(query.select);
    return await paginate(query, this.getRepository(), config).catch((error) => {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    });
  }

  async findOneById(id: number) {
    try {
      return await this.getRepository().findOneBy({ id, active: true });
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }
}
