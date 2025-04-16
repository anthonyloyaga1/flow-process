import { ApiProperty } from '@nestjs/swagger';

import { SuccessDoc } from '../../../../shared/base-class/doc-base';
import { ReportProviderAccountStatusDto } from '../dto/report-provider-account-status.dto';

export class ReportProviderAccountStatusBasicDoc extends SuccessDoc {
  @ApiProperty({ type: ReportProviderAccountStatusDto, description: 'Datos del reporte matriz RAC' })
  data: ReportProviderAccountStatusDto;
}

export class ReportProviderAccountStatusDoc extends SuccessDoc {
  @ApiProperty({ type: ReportProviderAccountStatusDto, description: 'Datos del reporte matriz RAC' })
  data: ReportProviderAccountStatusDto;
}

export class ReportProviderAccountStatusListDoc extends SuccessDoc {
  @ApiProperty({ type: [ReportProviderAccountStatusDto], description: 'Lista de reportes matriz RAC' })
  data: ReportProviderAccountStatusDto[];
}
