import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PaginateQuery } from 'nestjs-paginate';

import { Metadata } from '../../../../shared/base-class/payload-base';
import { Provider } from '../../../domain/rac/models/provider';
import { ProvidersDomService } from '../../../domain/rac/services/providers.dom.service';
import { CreateProviderDto } from '../dto/create-provider.dto';
import { ProviderDto } from '../dto/provider.dto';

@Injectable()
export class ProvidersService {
  constructor(private readonly providersDomService: ProvidersDomService) {}

  async create(body: CreateProviderDto, metadata: Metadata): Promise<ProviderDto> {
    const provider = plainToInstance(Provider, body);

    provider.createdBy = metadata.user.preferred_username;
    const providerSaved = await this.providersDomService.create(provider);

    return plainToInstance(ProviderDto, providerSaved, { excludeExtraneousValues: true });
  }

  async findCollection(query: PaginateQuery) {
    const collection = await this.providersDomService.findCollection(query);
    const mappedCollection = plainToInstance(ProviderDto, collection.data, { excludeExtraneousValues: true });
    return { collection: mappedCollection, meta: collection.meta, links: collection.links };
  }

  findOneByUnicodigo(unicode: number) {
    const provider = this.providersDomService.findOneByUnicodigo(unicode);
    return plainToInstance(ProviderDto, provider, { excludeExtraneousValues: true });
  }

  findOneById(id: number) {
    const provider = this.providersDomService.findOneById(id);
    return plainToInstance(ProviderDto, provider, { excludeExtraneousValues: true });
  }
}
