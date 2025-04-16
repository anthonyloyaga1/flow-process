import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import * as dayjs from 'dayjs';
import { DtoBase } from 'src/shared/base-class/dto-base';

import { CatalogDetailDto } from '../../common/dto/catalog-detail.dto';

export class CurReviewBasicDto extends DtoBase {
  @Expose()
  @ApiProperty({ example: 1, description: 'Identificador del registro' })
  id: number;

  @Expose()
  @ApiProperty({ example: 1, description: 'Identificador del proceso asociado' })
  processId: number;

  @Expose()
  @ApiProperty({ example: dayjs().toDate(), description: 'Fecha de inicio en el estado actual' })
  currentStageStartDate: Date;

  @Expose()
  @ApiProperty({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha CUR' })
  curDate: string;

  @Expose()
  @ApiProperty({ example: 123, description: 'Número CUR' })
  curNumber: number;

  @Expose()
  @ApiProperty({ example: 32, description: 'Estado del CUR 32. PENDIENTE DE ACREDITACIÓN, 33. PAGADO' })
  statusCurId: number;

  @Expose()
  @ApiProperty({ example: '1234567890', description: 'Identificación del coordinador de zona' })
  zoneCoordinatorIdentifier: string;

  @Expose()
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del coordinador de zona' })
  zoneCoordinatorName: string;

  @Expose()
  @ApiPropertyOptional({ example: 'Observaciones sobre el CUR', description: 'Observaciones' })
  observations?: string;

  @Expose()
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del usuario que crea el CUR' })
  createdByName: string;

  @Expose()
  @ApiProperty({ example: 'JP', description: 'Iniciales del usuario que crea el CUR' })
  createdByInitials: string;
}

export class CurReviewDto extends CurReviewBasicDto {
  @Expose()
  @ApiProperty({ type: () => CatalogDetailDto, description: 'Estado del CUR' })
  @Type(() => CatalogDetailDto)
  statusCur: CatalogDetailDto;
}
