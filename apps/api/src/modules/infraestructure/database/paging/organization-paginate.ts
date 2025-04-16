// * PaginateConfig: Para uso en funcionalidad de la creación de una colección paginada basada en el estandar JSON:API (https://jsonapi.org/)
import { FilterOperator, PaginateConfig } from 'nestjs-paginate';

import { OrganizationEntity } from '../entities/organization.entity';

export const organizationPaginateConfig = (query?: string[]): PaginateConfig<OrganizationEntity> => ({
  // ! NO USAR defaultSortBy: por defecto si se usa select porque no se puede ordenar por campos que no estan en el select
  // * USAR relations: Aquí si se necesita para indicar las relaciones de la entidad de la BDD
  // * En sortableColumns puede ser que no se cargue el tipado de objetos anidados mayor a 3 niveles, por esta razón se debe usar 'any'. Esto no afecta en funcionalidad solo en tipado.

  select: query,

  sortableColumns: ['id', 'creationDate', 'organizationName', 'ecProvinceName', 'ecZoneName'],
  searchableColumns: ['organizationName'],
  filterableColumns: {
    id: [FilterOperator.EQ],
    identifier: [FilterOperator.ILIKE],
    organizationType: [FilterOperator.ILIKE],
    organizationName: [FilterOperator.SW, FilterOperator.ILIKE],
    ecLevelId: [FilterOperator.EQ],
    ecLevelName: [FilterOperator.SW, FilterOperator.ILIKE],
    ecTypologyId: [FilterOperator.EQ],
    ecTypologyName: [FilterOperator.SW, FilterOperator.ILIKE],
    ecInstitutionId: [FilterOperator.EQ],
    ecInstitutionName: [FilterOperator.SW, FilterOperator.ILIKE],
    ecProvinceId: [FilterOperator.EQ],
    ecProvinceCode: [FilterOperator.EQ],
    ecProvinceName: [FilterOperator.SW, FilterOperator.ILIKE],
    ecCantonId: [FilterOperator.EQ],
    ecCantonCode: [FilterOperator.EQ],
    ecCantonName: [FilterOperator.SW, FilterOperator.ILIKE],
    ecParishId: [FilterOperator.EQ],
    ecParishCode: [FilterOperator.EQ],
    ecParishName: [FilterOperator.SW, FilterOperator.ILIKE],
    ecZoneId: [FilterOperator.EQ],
    ecZoneCode: [FilterOperator.EQ],
    ecZoneDistribution: [FilterOperator.SW, FilterOperator.ILIKE],
    ecDistrictId: [FilterOperator.EQ],
    ecDistrictCode: [FilterOperator.EQ],
  },
  where: { active: true },
});
