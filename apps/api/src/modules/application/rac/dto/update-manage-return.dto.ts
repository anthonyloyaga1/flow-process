import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { ProcessReturnRequestStatusEnum } from 'src/shared/constants/processes';

export class UpdateManageReturnToPreviousStageDto {
  @ApiProperty({ examples: [29, 30], description: 'Estado de trámite 29. APROBADO RETORNO, 30. RECHAZADO RETORNO' })
  @IsEnum(ProcessReturnRequestStatusEnum)
  statusId: number;

  @ApiProperty({ example: 'Motivo de rechazo de aprobación de retorno', description: 'Motivo de rechazo de aprobación de retorno' })
  @IsString()
  returnApprovalRejectionReason: string;
}
