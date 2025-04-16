import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import * as dayjs from 'dayjs';

import { DtoBase } from '../../../../shared/base-class/dto-base';

export class TariffControlBasicDto extends DtoBase {
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
  liquidationStartDate: string;

  @Expose()
  @ApiProperty({ example: 943.42, description: 'Valor aprobado' })
  approvedValue: number;

  @Expose()
  @ApiProperty({ example: 500.47, description: 'Valor objetado' })
  objectedValue: number;

  @Expose()
  @ApiProperty({ example: 'Motivo del retraso', description: 'Motivo del retraso' })
  delayReason: string;

  @Expose()
  @ApiProperty({ example: 5, description: 'Cantidad de expedientes objetados' })
  objectedFilesCount: number;

  @Expose()
  @ApiProperty({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de entrega de los expedientes' })
  filesDeliveryDate: string;

  @Expose()
  @ApiProperty({ example: 1, description: 'Cantidad de expedientes objetados por la ACFSS' })
  objectedFilesCountACFSS: number;

  @Expose()
  @ApiProperty({ example: 'Detalles de los expedientes objetados', description: 'Detalles de los expedientes objetados' })
  objectedFilesDetails: string;

  @Expose()
  @ApiProperty({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de envío de la gestión documental' })
  documentManagementSendDate: string;

  @Expose()
  @ApiProperty({ example: 'INF-13456-2024', description: 'Número de informe' })
  reportNumber: string;

  @Expose()
  @ApiProperty({ example: 'MSP-MSP-2024-1021-M', description: 'Número de memorando' })
  memorandumNumber: string;

  @Expose()
  @ApiProperty({ example: '1710173677', description: 'Identificación del responsable de gestión documental' })
  documentManagementResponsibleIdentifier: string;

  @Expose()
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del responsable de gestión documental' })
  documentManagementResponsibleName: string;

  @Expose()
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del usuario que creó el registro' })
  createdByName: string;

  @Expose()
  @ApiProperty({ example: 'JP', description: 'Iniciales del usuario que creó el registro' })
  createdByInitials: string;
}

export class TariffControlDto extends TariffControlBasicDto {}
