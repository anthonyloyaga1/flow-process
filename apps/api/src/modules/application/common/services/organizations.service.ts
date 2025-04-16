import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PaginateQuery } from 'nestjs-paginate';

import { OrganizationsDomService } from '../../../domain/common/services/organization.dom.service';
import { OrganizationDto, OrganizationMinimalDto } from '../dto/organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly organizationsDomService: OrganizationsDomService) {}

  async findOneByUnicodigo(unicode: string) {
    const entidad = await this.organizationsDomService.findOneByUnicodigo(unicode);
    return plainToInstance(OrganizationDto, entidad, { excludeExtraneousValues: true });
  }

  async findCollection(query: PaginateQuery) {
    const collection = await this.organizationsDomService.findCollection(query);
    const mappedCollection = plainToInstance(OrganizationDto, collection.data, { excludeExtraneousValues: true });
    return { collection: mappedCollection, meta: collection.meta, links: collection.links };
  }

  async findListZones() {
    const zones = await this.organizationsDomService.findListZones();
    return plainToInstance(OrganizationMinimalDto, zones, { excludeExtraneousValues: true });
  }
}
