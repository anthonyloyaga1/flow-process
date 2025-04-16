import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class StageProcessDto {
  @Expose()
  @ApiProperty({ type: 'number', description: 'Id del estado del trámite' })
  id: number;

  @Expose()
  @ApiProperty({ type: 'string', description: 'Nombre del estado del trámite' })
  stageName: string;

  @Expose()
  @ApiProperty({ type: 'string', description: 'Descripción del estado del trámite' })
  description: string;

  @Expose()
  @ApiProperty({ type: 'number', isArray: true, description: 'Estados a los que puede regresar el trámite' })
  allowedReturnStage: number[];

  @Expose()
  @ApiProperty({ type: 'number', description: 'Siguiente estado del trámite' })
  nextStageId: number;
}
