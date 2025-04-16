import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReportBudgetRequirementDto {
  @Expose()
  @ApiProperty({ example: 1, description: 'ID del proceso' })
  processesId: number;

  @Expose()
  @ApiProperty({ example: 'CZ01-AMB-2025-02-00076', description: 'Número de caso' })
  caseNumber: string;

  @Expose()
  @ApiProperty({ example: 'AZUAY', description: 'Descripción de la provincia del proveedor' })
  providerProvinceDescription: string;

  @Expose()
  @ApiProperty({ example: '0160006710001', description: 'RUC del proveedor' })
  providerRuc: string;

  @Expose()
  @ApiProperty({ example: 'I NIVEL DE ATENCION', description: 'Nivel de atención del proveedor' })
  providerAttentionLevel: string;

  @Expose()
  @ApiProperty({ example: 'CENTRO DE SALUD TIPO A', description: 'Denominación del proveedor' })
  providerDenomination: string;

  @Expose()
  @ApiProperty({ example: 'LLACAO', description: 'Nombre del proveedor' })
  providerName: string;

  @Expose()
  @ApiProperty({ example: 2, description: 'Mes del servicio' })
  serviceMonth: number;

  @Expose()
  @ApiProperty({ example: 2025, description: 'Año del servicio' })
  serviceYear: number;

  @Expose()
  @ApiProperty({ example: '02-2025', description: 'Mes y año del servicio' })
  serviceMonthYear: string;

  @Expose()
  @ApiProperty({ example: 1234, description: 'Número de archivos' })
  fileCount: number;

  @Expose()
  @ApiProperty({ example: 'PRIMERA VEZ', description: 'Nombre del tipo de entrada' })
  entryTypeName: string;

  @Expose()
  @ApiProperty({ example: true, description: 'Indica si el proceso es catastrófico' })
  isCatastrophic: boolean;

  @Expose()
  @ApiProperty({ example: 12345.67, description: 'Valor aprobado' })
  approvedValue: number;

  @Expose()
  @ApiProperty({ example: 'ACHPE DIALIZADORAS', description: 'Nombre del grupo de proveedores' })
  providerGroupName: string;

  @Expose()
  @ApiProperty({ example: 'DIALIZADORAS', description: 'Nombre del grupo agregado de proveedores' })
  providerGroupAggregatedName: string;

  @Expose()
  @ApiProperty({ example: '2025-02-07T05:00:00.000Z', description: 'Fecha de solicitud de presupuesto' })
  budgetRequestDate: Date;

  @Expose()
  @ApiProperty({ example: 'CUR12345', description: 'Número de CUR' })
  curNumber: string;

  @Expose()
  @ApiProperty({ example: '2025-02-07T05:00:00.000Z', description: 'Fecha de CUR' })
  curDate: Date;

  @Expose()
  @ApiProperty({ example: 1, description: 'ID del proveedor' })
  providerId: number;

  @Expose()
  @ApiProperty({ example: '01', description: 'Código de la provincia del proveedor' })
  providerProvinceCode: string;

  @Expose()
  @ApiProperty({ example: 5, description: 'ID de la etapa actual del proceso' })
  processStageId: number;

  @Expose()
  @ApiProperty({ example: 'Z01', description: 'Código de la zona del proveedor' })
  providerZoneCode: string;

  @Expose()
  @ApiProperty({ example: '2025-02-06T05:00:00.000Z', description: 'Fecha de recepción del proceso' })
  receptionDate: Date;
}
