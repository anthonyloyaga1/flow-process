import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginatedMetaDocumented } from 'nestjs-paginate';

import { PaginatedLinksBase } from '../base-class/paginated-link-base.doc';

function buildPagingModel<DTO>(dtoType: new () => DTO) {
  class PagingBase {
    @ApiProperty({ type: 'array', items: { $ref: getSchemaPath(dtoType) }, description: 'Lista de datos paginados' })
    @Type(() => dtoType)
    collection: DTO[];

    @ApiProperty({ type: PaginatedMetaDocumented, description: 'Metadatos de la paginación' })
    meta: PaginatedMetaDocumented<DTO>;

    @ApiProperty({ type: PaginatedLinksBase, description: 'Links de la paginación' })
    links: PaginatedLinksBase;
  }

  return PagingBase;
}

export function buildPagingDoc<DTO>(dtoType: new () => DTO) {
  const PagingBase = buildPagingModel(dtoType);

  // Define la clase antes de retornarla
  class PagingDoc {
    @ApiProperty({ example: 'success', description: 'Estado de la respuesta' })
    status: string;

    @ApiProperty({ type: PagingBase, description: 'Información de datos paginados' })
    @Type(() => PagingBase)
    data: typeof PagingBase;
  }

  return PagingDoc;
}

export function buildSimpleDoc<DTO>(dtoType: new () => DTO) {
  // Define la clase antes de retornarla
  class SimpleDoc {
    @ApiProperty({ example: 'success', description: 'Estado de la respuesta' })
    status: string;

    @ApiProperty({ type: dtoType, description: 'Objeto simple de datos' })
    data: DTO;
  }

  return SimpleDoc;
}

export function buildListDoc<DTO>(dtoType: new () => DTO) {
  // Define la clase antes de retornarla
  class ListDoc {
    @ApiProperty({ example: 'success', description: 'Estado de la respuesta' })
    status: string;

    @ApiProperty({ type: [dtoType], description: 'Lista de objetos de datos' })
    data: DTO[];
  }

  return ListDoc;
}
