import { PartialType } from '@nestjs/swagger';

import { CreateCurReviewDto } from '../../rac/dto/create-cur-review.dto';

export class UpdateCurReviewDto extends PartialType(CreateCurReviewDto) {}
