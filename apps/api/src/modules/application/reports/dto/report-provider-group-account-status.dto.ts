import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReportProviderGroupAccountStatusDto {
  @Expose()
  @ApiProperty({ example: 1, description: 'ID del proveedor' })
  providerGroupAggregatedId: number;

  @Expose()
  @ApiProperty({ example: 'LLACAO', description: 'Nombre del proveedor' })
  providerGroupAggregatedName: string;

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
