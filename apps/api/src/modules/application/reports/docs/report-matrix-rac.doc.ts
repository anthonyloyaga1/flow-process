import { ApiProperty } from '@nestjs/swagger';

import { SuccessDoc } from '../../../../shared/base-class/doc-base';
import { ReportMatrixRacDto } from '../dto/report-matrix-rac.dto';

export class ReportMatrixRacBasicDoc extends SuccessDoc {
  @ApiProperty({ type: ReportMatrixRacDto, description: 'Datos del reporte matriz RAC' })
  data: ReportMatrixRacDto;
}

export class ReportMatrixracDoc extends SuccessDoc {
  @ApiProperty({ type: ReportMatrixRacDto, description: 'Datos del reporte matriz RAC' })
  data: ReportMatrixRacDto;
}

export class ReportMatrixRacListDoc extends SuccessDoc {
  @ApiProperty({ type: [ReportMatrixRacDto], description: 'Lista de reportes matriz RAC' })
  data: ReportMatrixRacDto[];
}
