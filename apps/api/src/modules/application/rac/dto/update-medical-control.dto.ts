import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateMedicalControlDto } from './create-medical-control.dto';

export class UpdateMedicalControlDto extends PartialType(OmitType(CreateMedicalControlDto, ['processId', 'startDate'])) {}
