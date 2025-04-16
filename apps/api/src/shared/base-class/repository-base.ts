import { HttpException } from '@nestjs/common';
import { DataSource, DeepPartial } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { ErrorMessage } from '../constants/error-messages';

export interface Constructable<ENTITY> {
  new (): ENTITY;
}

export abstract class RepositoryBase<ENTITY> {
  protected abstract readonly entity: Constructable<ENTITY>;

  constructor(private readonly dataSource: DataSource) {}

  getRepository() {
    return this.dataSource.getRepository(this.entity);
  }

  getDataSource() {
    return this.dataSource;
  }

  async insert<MODEL>(model: MODEL) {
    try {
      const modelAux = <DeepPartial<ENTITY>>model;
      const entidad = this.getRepository().create({ ...modelAux });
      const savedEntidad = await this.getRepository().save(entidad);
      model['id'] = savedEntidad['id'];
      return model;
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async update<MODEL>(model: MODEL) {
    try {
      const modelAux = <DeepPartial<ENTITY>>{ ...model };
      const modelId = { id: modelAux['id'] };
      delete modelAux['id'];
      const entidad = this.getRepository().create(modelAux);
      await this.getRepository().update(modelId, <QueryDeepPartialEntity<ENTITY>>entidad);
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async delete(id: number) {
    try {
      await this.getRepository().delete(id);
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }
}
