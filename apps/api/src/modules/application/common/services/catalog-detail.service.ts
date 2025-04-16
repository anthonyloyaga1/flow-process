import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PaginateQuery } from 'nestjs-paginate';

import { CatalogDetailDomService } from '../../../domain/common/services/catalog-detail.dom.service';
import { CatalogDetailDto } from '../dto/catalog-detail.dto';

@Injectable()
export class CatalogDetailService {
  constructor(private readonly catalogDetailDomService: CatalogDetailDomService) {}

  async findCollection(query: PaginateQuery) {
    const collection = await this.catalogDetailDomService.findCollection(query);
    const mappedCollection = plainToInstance(CatalogDetailDto, collection.data, { excludeExtraneousValues: true });
    return { collection: mappedCollection, meta: collection.meta, links: collection.links };
  }

  findOneById(id: number) {
    const catalogDetail = this.catalogDetailDomService.findOneById(id);
    return plainToInstance(CatalogDetailDto, catalogDetail, { strategy: 'excludeAll' });
  }
}
