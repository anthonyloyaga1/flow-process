import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { DtoBase } from '../../../../shared/base-class/dto-base';
import { CatalogDetailDto } from './catalog-detail.dto';

export class ProviderGroupDto extends DtoBase {
  @Expose()
  @ApiProperty({ example: 1, description: 'Identificador único del grupo de prestadores' })
  id: number;

  @Expose()
  @ApiProperty({ example: 'Nombre del Grupo de Prestadores', description: 'Nombre del grupo de prestadores' })
  name: string;

  @Exclude()
  providerGroupAggregatedId: number;

  @Expose()
  @Type(() => CatalogDetailDto)
  providerGroupAggregated: CatalogDetailDto;
}
