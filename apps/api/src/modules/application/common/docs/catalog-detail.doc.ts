import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { PaginateConfig } from 'nestjs-paginate';

import { PagingModel, SuccessDoc } from '../../../../shared/base-class/doc-base';
import { CatalogDetailEntity } from '../../../infraestructure/database/entities/catalog-detail.entity';
import { catalogDetailPaginateConfig } from '../../../infraestructure/database/paging/catalog-detail.paginate';
import { CatalogDetailDto } from '../dto/catalog-detail.dto';

const selectDocExamples = ['id', 'name', 'numericValue', 'characterValue'];

export const catalogDetailPaginateDocConfig: PaginateConfig<CatalogDetailEntity> = catalogDetailPaginateConfig(selectDocExamples);

class CatalogDetailPagingModel {
  @ApiProperty({ type: [CatalogDetailDto], description: 'Colección de catálogos' })
  collection: CatalogDetailDto[];
}

class CatalogDetailPagingData extends IntersectionType(CatalogDetailPagingModel, PagingModel<CatalogDetailDto>) {}

export class CatalogDetailPagingDoc extends SuccessDoc {
  @ApiProperty({ type: CatalogDetailPagingData, description: 'Datos de catálogo paginados' })
  data: CatalogDetailPagingData;
}

export class CatalogDetailSimpleDoc extends SuccessDoc {
  @ApiProperty({ type: CatalogDetailDto, description: 'Datos de catálogo' })
  data: CatalogDetailDto;
}
