// * PaginateConfig: Para uso en funcionalidad de la creación de una colección paginada basada en el estandar JSON:API (https://jsonapi.org/)
import { FilterOperator, PaginateConfig } from 'nestjs-paginate';

import { ProvinceEntity } from '../entities/province.entity';

// ! NO USAR searchableColumns: porque hace búsquedas tipo like
// ! NO USAR defaultSortBy: por defecto si se usa select porque no se puede ordenar por campos que no estan en el select
// * USAR relations: Aquí si se necesita para indicar las relaciones de la entidad de la BDD

// * En sortableColumns puede ser que no se cargue el tipado de objetos anidados mayor a 3 niveles, por esta razón se debe usar 'any'. Esto no afecta en funcionalidad solo en tipado.

export const provincesPaginateConfig = (query?: string[]): PaginateConfig<ProvinceEntity> => ({
  select: query,
  sortableColumns: ['id', 'name', 'code'],
  filterableColumns: { id: [FilterOperator.EQ] },
  searchableColumns: ['name', 'code'],
  where: { active: true },
});
