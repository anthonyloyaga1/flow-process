import { ApiProperty, ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { IsDateString, IsOptional, ValidateNested } from 'class-validator';
import * as dayjs from 'dayjs';

import { CreateDocumentaryReviewDto } from './create-documentary-review.dto';
import { Type } from 'class-transformer';
import { UpdateRestoreStageProcessDto } from './update-process.dto';

export class UpdateDocumentaryReviewDto extends PartialType(OmitType(CreateDocumentaryReviewDto, ['processId'])) {
  @ApiPropertyOptional({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de segunda recepción del trámite' })
  @IsOptional()
  @IsDateString()
  secondReviewDate: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateRestoreStageProcessDto)
  process?: UpdateRestoreStageProcessDto;
}
