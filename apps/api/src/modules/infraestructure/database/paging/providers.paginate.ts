// * PaginateConfig: Para uso en funcionalidad de la creación de una colección paginada basada en el estandar JSON:API (https://jsonapi.org/)
import { FilterOperator, PaginateConfig } from 'nestjs-paginate';

import { ProviderEntity } from '../entities/provider.entity';

export const providersPaginateConfig = (query?: string[]): PaginateConfig<ProviderEntity> => ({
  select: query,
  sortableColumns: ['id', 'name', 'unicode'],
  filterableColumns: {
    id: [FilterOperator.EQ],
    providerGroupId: [FilterOperator.EQ],
    unicode: [FilterOperator.EQ],
    name: [FilterOperator.EQ, FilterOperator.SW],
    zoneCode: [FilterOperator.EQ],
    provinceCode: [FilterOperator.EQ],
  },
  searchableColumns: ['name', 'unicode'],
  relations: ['providerGroup', 'providerGroup.providerGroupAggregated'],
  where: { active: true },
});
