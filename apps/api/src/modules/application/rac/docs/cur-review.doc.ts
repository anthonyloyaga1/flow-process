import { ApiProperty } from '@nestjs/swagger';

import { SuccessDoc } from '../../../../shared/base-class/doc-base';
import { CurReviewBasicDto, CurReviewDto } from '../dto/cur-review.dto';

export class CurReviewBasicDoc extends SuccessDoc {
  @ApiProperty({ type: CurReviewBasicDto, description: 'Datos de trámite' })
  data: CurReviewBasicDto;
}

export class CurReviewDoc extends SuccessDoc {
  @ApiProperty({ type: CurReviewDto, description: 'Datos de trámite' })
  data: CurReviewDto;
}

export class CurReviewListDoc extends SuccessDoc {
  @ApiProperty({ type: [CurReviewDto], description: 'Datos de trámite' })
  data: CurReviewDto[];
}
