import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PaginateQuery } from 'nestjs-paginate';

import { ProvincesDomService } from '../../../domain/common/services/provinces.dom.service';
import { ProvinceDto } from '../dto/province.dto';

@Injectable()
export class ProvinciaService {
  constructor(private readonly provincesDomService: ProvincesDomService) {}

  async findCollection(query: PaginateQuery): Promise<any> {
    const collection = await this.provincesDomService.findCollection(query);
    const mappedCollection = plainToInstance(ProvinceDto, collection.data, { excludeExtraneousValues: true });
    return { collection: mappedCollection, meta: collection.meta, links: collection.links };
  }

  findOneByCode(code: string) {
    const province = this.provincesDomService.findOneByCode(code);
    return plainToInstance(ProvinceDto, province, { strategy: 'excludeAll' });
  }
}
