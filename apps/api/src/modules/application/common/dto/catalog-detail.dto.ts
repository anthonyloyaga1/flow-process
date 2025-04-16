import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { DtoBase } from '../../../../shared/base-class/dto-base';
import { CatalogHeaderDto } from './catalog-header.dto';

export class CatalogDetailBasic extends DtoBase {
  @Expose()
  @ApiProperty({ example: 1, description: 'Identificador único del catálogo' })
  id: number;

  @Expose()
  @ApiProperty({ example: 'Nombre del Catálogo', description: 'Nombre del catálogo' })
  name: string;

  @Expose()
  @ApiProperty({ example: 1, description: 'Valor numérico' })
  numericValue: number;

  @Expose()
  @ApiProperty({ example: 'Valor Caracter', description: 'Valor caracter' })
  characterValue: string;

  @Expose()
  @ApiProperty({ example: 1, description: 'Identificador único de la cabecera catálogo' })
  catalogHeaderId: number;
}

export class CatalogDetailDto extends CatalogDetailBasic {
  @Expose()
  @ApiProperty({ example: 'Nombre del Catálogo', description: 'Nombre del catálogo' })
  @Type(() => CatalogHeaderDto)
  catalogHeader: CatalogHeaderDto;
}
