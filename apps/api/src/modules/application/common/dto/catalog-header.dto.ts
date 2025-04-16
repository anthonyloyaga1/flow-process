import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ModelBase } from '../../../../shared/base-class/model-base';

export class CatalogHeaderDto extends ModelBase {
  @Expose()
  @ApiProperty({ example: 1, description: 'Identificador único del catálogo' })
  id: number;

  @Expose()
  @ApiProperty({ example: 'Nombre del Catálogo', description: 'Nombre del catálogo' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'Descripción del Catálogo', description: 'Descripción del catálogo' })
  description: string;
}
