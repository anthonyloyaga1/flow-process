import { Module } from '@nestjs/common';
import { TariffControlsDomService } from 'src/modules/domain/rac/services/tariff-controls.dom.service';

import { BudgetShipmentsDomService } from '../../domain/rac/services/budget-shipments.dom.service';
import { CurReviewsDomService } from '../../domain/rac/services/cur-reviews.dom.service';
import { DocumentaryReviewsDomService } from '../../domain/rac/services/documentary-reviews.dom.service';
import { ProvidersDomService } from '../../domain/rac/services/providers.dom.service';
import { ManageReturnsDomService } from '../../domain/rac/services/manage-return.dom.service';
import { MedicalControlsDomService } from '../../domain/rac/services/medical-controls.dom.service';
import { PaymentShipmentsDomService } from '../../domain/rac/services/payment-shipments.dom.service';
import { ProcessesDomService } from '../../domain/rac/services/processes.dom.service';
import { InfraestructureModule } from '../../infraestructure/infraestructure.module';
import { BudgetShipmentsController } from './controllers/budget-shipments.controller';
import { CurReviewsController } from './controllers/cur-reviews.controller';
import { DocumentaryReviewsController } from './controllers/documentary-reviews.controller';
import { ManageReturnsController } from './controllers/manage-returns.controller';
import { MedicalControlsController } from './controllers/medical-controls.controller';
import { PaymentShipmentsController } from './controllers/payment-shipments.controller';
import { ProcessesController } from './controllers/processes.controller';
import { ProvidersController } from './controllers/providers.controller';
import { TariffControlsController } from './controllers/tariff-controls.controller';
import { BudgetShipmentsService } from './services/budget-shipments.service';
import { CurReviewsService } from './services/cur-reviews.service';
import { DocumentaryReviewsService } from './services/documentary-reviews.service';
import { ManageReturnsService } from './services/manage-returns.service';
import { MedicalControlsService } from './services/medical-controls.service';
import { PaymentShipmentsService } from './services/payment-shipments.service';
import { ProcessesService } from './services/processes.service';
import { ProvidersService } from './services/providers.service';
import { TariffControlsService } from './services/tariff-controls.service';

@Module({
  imports: [InfraestructureModule],
  controllers: [
    ProcessesController,
    ManageReturnsController,
    DocumentaryReviewsController,
    MedicalControlsController,
    TariffControlsController,
    BudgetShipmentsController,
    PaymentShipmentsController,
    CurReviewsController,
    ProvidersController,
  ],
  providers: [
    ProcessesService,
    ProcessesDomService,
    BudgetShipmentsService,
    BudgetShipmentsDomService,
    CurReviewsService,
    CurReviewsDomService,
    DocumentaryReviewsService,
    DocumentaryReviewsDomService,
    ProvidersService,
    ProvidersDomService,
    ManageReturnsService,
    ManageReturnsDomService,
    MedicalControlsService,
    MedicalControlsDomService,
    PaymentShipmentsService,
    PaymentShipmentsDomService,
    TariffControlsService,
    TariffControlsDomService,
  ],
})
export class RacModule {}
