import { HttpException, Injectable } from '@nestjs/common';
import { PaginateQuery } from 'nestjs-paginate';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { ProvidersRepository } from '../../../infraestructure/database/repositories/providers.repository';
import { Provider } from '../models/provider';

@Injectable()
export class ProvidersDomService {
  constructor(private readonly providersRepository: ProvidersRepository) {}

  async create(data: Provider) {
    const provider = await this.providersRepository.findOneByUnicode(data.unicode);
    if (provider) throw new HttpException(ErrorMessage.PROVIDER_EXIST.MSG, ErrorMessage.PROVIDER_EXIST.CODE);
    return await this.providersRepository.insert(data);
  }

  async findOneById(id: number) {
    const provider = await this.providersRepository.findOneById(id);
    if (!provider) throw new HttpException(ErrorMessage.PROVIDER_NOT_FOUND.MSG, ErrorMessage.PROVIDER_NOT_FOUND.CODE);
    return provider;
  }

  async findOneByUnicodigo(unicode: number) {
    const provider = await this.providersRepository.findOneByUnicode(unicode);
    if (!provider) throw new HttpException(ErrorMessage.PROVIDER_NOT_FOUND.MSG, ErrorMessage.PROVIDER_NOT_FOUND.CODE);

    return provider;
  }

  async findCollection(query: PaginateQuery) {
    return await this.providersRepository.findCollection(query);
  }
}
