import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import * as dayjs from 'dayjs';

import { DtoBase } from '../../../../shared/base-class/dto-base';

export class MedicalControlBasicDto extends DtoBase {
  @Expose()
  @ApiProperty({ example: 1, description: 'Identificador único de la revisión documental' })
  id: number;

  @Expose()
  @ApiProperty({ example: 1, description: 'Identificador del proceso asociado' })
  processId: number;

  @Expose()
  @ApiProperty({ example: dayjs().toDate(), description: 'Fecha de inicio en el estado actual' })
  currentStageStartDate: Date;

  @Expose()
  @ApiProperty({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de la revisión' })
  startDate: string;

  @Expose()
  @ApiProperty({ example: 'Motivo del retraso', description: 'Motivo del retraso' })
  delayReason: string;

  @Expose()
  @ApiProperty({ example: 'Detalles de los pacientes objetados', description: 'Detalles de los pacientes objetados' })
  objectedPatientsDetails: string;

  @Expose()
  @ApiProperty({ example: 5, description: 'Cantidad de expedientes objetados' })
  objectedFilesCount: number;

  @Expose()
  @ApiProperty({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de entrega de los expedientes' })
  filesDeliveryDate: string;

  @Expose()
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del usuario que creó el registro' })
  createdByName: string;

  @Expose()
  @ApiProperty({ example: 'JP', description: 'Iniciales del usuario que creó el registro' })
  createdByInitials: string;
}

export class MedicalControlDto extends MedicalControlBasicDto {}
