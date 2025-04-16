import { ApiProperty } from '@nestjs/swagger';

import { SuccessDoc } from '../../../../shared/base-class/doc-base';
import { ReportBudgetRequirementDto } from '../dto/report-budget-requirement.dto';

export class ReportBudgetRequirementBasicDoc extends SuccessDoc {
  @ApiProperty({ type: ReportBudgetRequirementDto, description: 'Datos del reporte matriz RAC' })
  data: ReportBudgetRequirementDto;
}

export class ReportBudgetRequirementDoc extends SuccessDoc {
  @ApiProperty({ type: ReportBudgetRequirementDto, description: 'Datos del reporte matriz RAC' })
  data: ReportBudgetRequirementDto;
}

export class ReportBudgetRequirementListDoc extends SuccessDoc {
  @ApiProperty({ type: [ReportBudgetRequirementDto], description: 'Lista de reportes matriz RAC' })
  data: ReportBudgetRequirementDto[];
}
