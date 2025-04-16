import { HttpException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { DataSource, In } from 'typeorm';

import { RepositoryBase } from '../../../../shared/base-class/repository-base';
import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { getZoneUnicodigos } from '../../../../shared/constants/zone-codes.enum';
import { Organization } from '../../../domain/common/models/organization';
import { OrganizationEntity } from '../entities/organization.entity';
import { organizationPaginateConfig } from '../paging/organization-paginate';

@Injectable()
export class OrganizationsRepository extends RepositoryBase<OrganizationEntity> {
  protected readonly entity = OrganizationEntity;

  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async findCollection(query: PaginateQuery) {
    try {
      const config = organizationPaginateConfig(query.select);
      return await paginate(query, this.getRepository(), config);
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async findOneById(id: number): Promise<Organization> {
    try {
      const entity = await this.getRepository().findOne({ where: { id, active: true } });
      return plainToInstance(Organization, entity);
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }

  async findListZones() {
    try {
      const zoneUnicodes = getZoneUnicodigos();
      const entities = await this.getRepository().find({
        select: { id: true, organizationName: true, ecZoneCode: true, zoneProvinces: { id: true, province: { id: true, name: true, code: true } } },
        where: { active: true, id: In(zoneUnicodes) },
        relations: { zoneProvinces: { province: true } },
      });
      return entities.map((entity) => {
        const provinces = entity.zoneProvinces.map((zoneProvince) => zoneProvince.province);
        return {
          ...plainToInstance(Organization, { ...entity, zoneProvinces: provinces }),
        };
      });
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }
}
