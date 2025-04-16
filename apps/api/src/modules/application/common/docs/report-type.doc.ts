import { ApiProperty } from '@nestjs/swagger';

import { SuccessDoc } from '../../../../shared/base-class/doc-base';
import { ReportDto } from '../dto/report.dto';

export class ReportTypeDoc extends SuccessDoc {
  @ApiProperty({ type: ReportDto, description: 'Catálogo de reporte' })
  data: ReportDto;
}

export class ReportTypeListDoc extends SuccessDoc {
  @ApiProperty({ type: [ReportDto], description: 'Lista de catálogos de reportes' })
  data: ReportDto[];
}
