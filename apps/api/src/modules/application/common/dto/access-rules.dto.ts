import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SimpleAccessRulesDto {
  @Expose()
  @ApiProperty({ example: 'BudgetShipments', description: 'Nombre del recurso' })
  rsname: string;

  @Expose()
  @ApiProperty({ example: ['read', 'update', 'create', 'delete'], description: 'Lista de permisos' })
  scopes: string[];
}
