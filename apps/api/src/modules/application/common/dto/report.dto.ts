import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { DtoBase } from '../../../../shared/base-class/dto-base';

export class ReportDto extends DtoBase {
  @Expose()
  @ApiProperty({ example: 1, description: 'Identificador único del reporte' })
  id: number;

  @Expose()
  @ApiProperty({ example: 'Nombre del Reporte', description: 'Nombre del reporte' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'Descripción del Reporte', description: 'Descripción del reporte' })
  description: string;
}
