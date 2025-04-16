import { FilterOperator, PaginateConfig } from 'nestjs-paginate';

import { CatalogDetailEntity } from '../entities/catalog-detail.entity';

export const catalogDetailPaginateConfig = (query?: string[]): PaginateConfig<CatalogDetailEntity> => ({
  select: query,
  sortableColumns: ['id', 'name', 'numericValue', 'characterValue'],
  filterableColumns: { id: [FilterOperator.EQ], catalogHeaderId: [FilterOperator.EQ, FilterOperator.IN] },
  relations: ['catalogHeader'],
  where: { active: true },
});
