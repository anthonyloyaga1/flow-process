import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BudgetShipmentEntity } from './entities/budget-shipment.entity';
import { CatalogDetailEntity } from './entities/catalog-detail.entity';
import { CatalogHeaderEntity } from './entities/catalog-header.entity';
import { CurReviewEntity } from './entities/cur-review.entity';
import { DocumentaryReviewEntity } from './entities/documentary-review.entity';
import { MedicalControlEntity } from './entities/medical-control.entity';
import { OrganizationEntity } from './entities/organization.entity';
import { PaymentShipmentEntity } from './entities/payment-shipment.entity';
import { ProcessEntity } from './entities/process.entity';
import { ProviderGroupEntity } from './entities/provider-group';
import { ProviderEntity } from './entities/provider.entity';
import { ProvinceEntity } from './entities/province.entity';
import { ReportBudgetRequirementView } from './entities/report-budget-requirement.view';
import { ReportMatrixRacView } from './entities/report-matrix.view';
import { ReportProviderAccountStatusView } from './entities/report-provider-account-status.view';
import { ReportProviderGroupAccountStatusView } from './entities/report-provider-group-account-status.view';
import { ReportTypeEntity } from './entities/report-type.entity';
import { StageProcessEntity } from './entities/stage_process.entity';
import { TariffControlEntity } from './entities/tariff_control.entity';
import { ZoneProvinceEntity } from './entities/zone-province.entity';
import { BudgetShipmentsRepository } from './repositories/budget-shipments.repository';
import { CatalogDetailRepository } from './repositories/catalog-detail.repository';
import { CurReviewsRepository } from './repositories/cur-reviews.repository';
import { DocumentaryReviewsRepository } from './repositories/documentary-reviews.repository';
import { MedicalControlsRepository } from './repositories/medical-controls.repository';
import { OrganizationsRepository } from './repositories/organizations.reposistory';
import { PaymentShipmentsRepository } from './repositories/payment-shipments.repository';
import { ProcessesRepository } from './repositories/processes.repository';
import { ProviderGroupsRepository } from './repositories/provider-groups.repository';
import { ProvidersRepository } from './repositories/providers.repository';
import { ProvinciesRepository } from './repositories/provinces.repository';
import { ReportBudgetRequirementRepository } from './repositories/report-budget-requirement.repository';
import { ReportMatrixRacRepository } from './repositories/report-matrix-rac.repository';
import { ReportProviderGroupAccountStatusRepository } from './repositories/report-provider-account-group-status-repository';
import { ReportProviderAccountStatusRepository } from './repositories/report-provider-account-status-repository';
import { ReportTypesRepository } from './repositories/report-types.repository';
import { StageProcessesRepository } from './repositories/stage-processes.repository';
import { TariffControlsRepository } from './repositories/tariff-controls.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProcessEntity,
      ProvinceEntity,
      CatalogHeaderEntity,
      CatalogDetailEntity,
      ProviderGroupEntity,
      ProviderEntity,
      OrganizationEntity,
      StageProcessEntity,
      DocumentaryReviewEntity,
      MedicalControlEntity,
      TariffControlEntity,
      BudgetShipmentEntity,
      PaymentShipmentEntity,
      CurReviewEntity,
      ZoneProvinceEntity,
      ReportTypeEntity,
      ReportMatrixRacView,
      ReportProviderAccountStatusView,
      ReportBudgetRequirementView,
      ReportProviderGroupAccountStatusView,
    ]),
  ],
  providers: [
    ProcessesRepository,
    ProvinciesRepository,
    ProviderGroupsRepository,
    ProvidersRepository,
    OrganizationsRepository,
    CatalogDetailRepository,
    StageProcessesRepository,
    DocumentaryReviewsRepository,
    MedicalControlsRepository,
    TariffControlsRepository,
    BudgetShipmentsRepository,
    PaymentShipmentsRepository,
    CurReviewsRepository,
    ReportTypesRepository,
    ReportMatrixRacRepository,
    ReportProviderAccountStatusRepository,
    ReportBudgetRequirementRepository,
    ReportProviderGroupAccountStatusRepository,
  ],
  exports: [
    ProcessesRepository,
    ProvinciesRepository,
    ProviderGroupsRepository,
    ProvidersRepository,
    OrganizationsRepository,
    CatalogDetailRepository,
    StageProcessesRepository,
    DocumentaryReviewsRepository,
    MedicalControlsRepository,
    TariffControlsRepository,
    BudgetShipmentsRepository,
    PaymentShipmentsRepository,
    CurReviewsRepository,
    ReportTypesRepository,
    ReportMatrixRacRepository,
    ReportProviderAccountStatusRepository,
    ReportBudgetRequirementRepository,
    ReportProviderGroupAccountStatusRepository,
  ],
})
export class RacDbModule {}
