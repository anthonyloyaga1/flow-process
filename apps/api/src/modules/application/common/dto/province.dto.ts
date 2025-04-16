import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { DtoBase } from '../../../../shared/base-class/dto-base';

export class ProvinceDto extends DtoBase {
  @Expose()
  @ApiProperty({ example: 1, description: 'Identificador único de la provincia' })
  id: number;

  @Expose()
  @ApiProperty({ example: 'Nombre de la Provincia', description: 'Nombre de la provincia' })
  name: string;

  @Expose()
  @ApiProperty({ example: '01', description: 'Código de la provincia' })
  code: string;
}
