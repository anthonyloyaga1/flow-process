import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReportProviderAccountStatusDto {
  @Expose()
  @ApiProperty({ example: '01', description: 'Código de la provincia del proveedor' })
  providerProvinceCode: string;

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
  @ApiProperty({ example: 1, description: 'ID del grupo de proveedores' })
  providerGroupId: number;

  @Expose()
  @ApiProperty({ example: 'ACHPE DIALIZADORAS', description: 'Nombre del grupo de proveedores' })
  providerGroupName: string;

  @Expose()
  @ApiProperty({ example: 1, description: 'ID del grupo agregado de proveedores' })
  providerGroupAggregatedId: number;

  @Expose()
  @ApiProperty({ example: 'DIALIZADORAS', description: 'Nombre del grupo agregado de proveedores' })
  providerGroupAggregatedName: string;

  @Expose()
  @ApiProperty({ example: 1, description: 'ID del proveedor' })
  providerId: number;

  @Expose()
  @ApiProperty({ example: '135802.37', description: 'Monto total solicitado' })
  totalRequestedAmount: string;

  @Expose()
  @ApiProperty({ example: '15675.92', description: 'Valor total objetado' })
  totalObjectedValue: string;

  @Expose()
  @ApiProperty({ example: '13767.42', description: 'Valor total aprobado en las etapas 6, 7 y 8' })
  totalApprovedValueStage_6_7_8: string;

  @Expose()
  @ApiProperty({ example: '1234.00', description: 'Valor total aprobado en la etapa 7' })
  totalApprovedValueStage_7: string;

  @Expose()
  @ApiProperty({ example: '74074.02', description: 'Monto total solicitado en las etapas 1, 2, 3 y 4' })
  totalRequestedAmountStage_1_2_3_4: string;

  @Expose()
  @ApiProperty({ example: '0', description: 'Monto total aprobado en la etapa 5' })
  totalApprovedValue_5: string;

  @Expose()
  @ApiProperty({ example: '0', description: 'Monto total aprobado en la etapa 6' })
  totalApprovedValue_6: string;
}
