import { HttpException, Injectable } from '@nestjs/common';
import { PaginateQuery } from 'nestjs-paginate';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { CatalogDetailRepository } from '../../../infraestructure/database/repositories/catalog-detail.repository';

@Injectable()
export class CatalogDetailDomService {
  constructor(private readonly catalogDetailRepository: CatalogDetailRepository) {}

  findCollection(query: PaginateQuery) {
    return this.catalogDetailRepository.findCollection(query);
  }

  async findOneById(id: number) {
    const catalogDetail = await this.catalogDetailRepository.findOneById(id);
    if (!catalogDetail) throw new HttpException(ErrorMessage.CATALOG_NOT_FOUND.MSG, ErrorMessage.CATALOG_NOT_FOUND.CODE);
    return catalogDetail;
  }
}
