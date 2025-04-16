import { ApiProperty } from '@nestjs/swagger';
import { PaginatedMetaDocumented } from 'nestjs-paginate';

import { PaginatedLinksBase } from './paginated-link-base.doc';

export class PagingModel<T> {
  @ApiProperty({ type: PaginatedMetaDocumented, description: 'Metadatos de la paginación' })
  meta: PaginatedMetaDocumented<T>;

  @ApiProperty({ type: PaginatedLinksBase, description: 'Links de la paginación' })
  links: PaginatedLinksBase;
}

export class SuccessDoc {
  @ApiProperty({ example: 'success', description: 'Estado de la respuesta' })
  status: string;
}

export class DeletedSuccessDoc {
  @ApiProperty({ example: 'success', description: 'Estado de la respuesta' })
  status: string;

  @ApiProperty({ example: 'Dato eliminado correctamente', description: 'mensaje de éxito' })
  data: string;
}
