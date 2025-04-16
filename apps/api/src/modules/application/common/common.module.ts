import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AccessRulesDomService } from 'src/modules/domain/common/services/access-rules.dom.service';
import { ReportTypesDomService } from 'src/modules/domain/common/services/report-types.dom.service';

import { CatalogDetailDomService } from '../../domain/common/services/catalog-detail.dom.service';
import { OrganizationsDomService } from '../../domain/common/services/organization.dom.service';
import { PersonSoapDomService } from '../../domain/common/services/person-soap.dom.service';
import { ProviderGroupsDomService } from '../../domain/common/services/provider-groups.dom.service';
import { ProvincesDomService } from '../../domain/common/services/provinces.dom.service';
import { StageProcessesDomService } from '../../domain/common/services/stage_processes.dom.service';
import { InfraestructureModule } from '../../infraestructure/infraestructure.module';
import { AccessController } from './controllers/access-rules.controller';
import { CatalogoController } from './controllers/catalog-detail.controller';
import { HealthController } from './controllers/health.controller';
import { OrganizationsController } from './controllers/organizations.controller';
import { PersonSoapController } from './controllers/person-soap.controller';
import { ProviderGroupsController } from './controllers/provider-groups.controller';
import { ProvincesController } from './controllers/provinces.controller';
import { ReportTypesController } from './controllers/report-types.controller';
import { StageProcessesController } from './controllers/stage-processes.controller';
import { AccessService } from './services/access-rules..service';
import { CatalogDetailService } from './services/catalog-detail.service';
import { HealthService } from './services/health.service';
import { OrganizationsService } from './services/organizations.service';
import { PersonSoapService } from './services/person-soap.service';
import { ProviderGroupsService } from './services/provider-groups.service';
import { ProvinciaService } from './services/provinces.service';
import { ReportsService } from './services/reports.service';
import { StageProcessesService } from './services/stage-processes.service';

@Module({
  imports: [TerminusModule, InfraestructureModule],
  controllers: [
    HealthController,
    ProvincesController,
    CatalogoController,
    ProviderGroupsController,
    OrganizationsController,
    StageProcessesController,
    PersonSoapController,
    AccessController,
    ReportTypesController,
  ],
  providers: [
    HealthService,
    ProvinciaService,
    ProvincesDomService,
    ProviderGroupsService,
    ProviderGroupsDomService,
    OrganizationsDomService,
    OrganizationsService,
    CatalogDetailService,
    CatalogDetailDomService,
    StageProcessesService,
    StageProcessesDomService,
    PersonSoapService,
    PersonSoapDomService,
    AccessService,
    AccessRulesDomService,
    ReportsService,
    ReportTypesDomService,
  ],
})
export class CommonModule {}
