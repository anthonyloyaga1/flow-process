import { Module } from '@nestjs/common';
import { ReportProviderGroupAccountStatusDomService } from 'src/modules/domain/reports/services/report-provider-group-account-status.dom.service';

import { ReportBudgetRequirementDomService } from '../../domain/reports/services/report-budget-requirement.dom.service';
import { ReportMatrixRacDomService } from '../../domain/reports/services/report-matrix-rac.dom.service';
import { ReportProviderAccountStatusDomService } from '../../domain/reports/services/report-provider-account-status.dom.service';
import { InfraestructureModule } from '../../infraestructure/infraestructure.module';
import { ReportBudgetRequirementController } from './controllers/report-budget-requirement.controller';
import { ReportMatrixRacController } from './controllers/report-matrix-rac.controller';
import { ReportProviderAccountStatusController } from './controllers/report-provider-account-status.controller';
import { ReportProviderGroupAccountStatusController } from './controllers/report-provider-group-account-status.controller';
import { ReportBudgetRequirementService } from './services/report-budget-requirement.service';
import { ReportMatrixRacService } from './services/report-matrix-rac.service';
import { ReportProviderAccountService } from './services/report-provider-acount-reports.service';
import { ReportProviderGroupAccountService } from './services/report-provider-group-acount-reports.service';

@Module({
  imports: [InfraestructureModule],
  controllers: [
    ReportMatrixRacController,
    ReportProviderAccountStatusController,
    ReportBudgetRequirementController,
    ReportProviderGroupAccountStatusController,
  ],
  providers: [
    ReportMatrixRacService,
    ReportMatrixRacDomService,
    ReportProviderAccountService,
    ReportProviderAccountStatusDomService,
    ReportBudgetRequirementService,
    ReportBudgetRequirementDomService,
    ReportProviderGroupAccountStatusDomService,
    ReportProviderGroupAccountService,
  ],
})
export class ReportsModule {}
