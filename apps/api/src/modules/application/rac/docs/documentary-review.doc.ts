import { ApiProperty } from '@nestjs/swagger';

import { SuccessDoc } from '../../../../shared/base-class/doc-base';
import { DocumentaryReviewBasicDto, DocumentaryReviewDto } from '../dto/documentary-review.dto';

export class DocumentaryReviewBasicDoc extends SuccessDoc {
  @ApiProperty({ type: DocumentaryReviewBasicDto, description: 'Datos de trámite' })
  data: DocumentaryReviewBasicDto;
}

export class DocumentaryReviewDoc extends SuccessDoc {
  @ApiProperty({ type: DocumentaryReviewDto, description: 'Datos de trámite' })
  data: DocumentaryReviewDto;
}

export class DocumentaryReviewListDoc extends SuccessDoc {
  @ApiProperty({ type: [DocumentaryReviewDto], description: 'Datos de trámite' })
  data: DocumentaryReviewDto[];
}
