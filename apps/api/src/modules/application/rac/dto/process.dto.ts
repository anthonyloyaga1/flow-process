import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import * as dayjs from 'dayjs';

import { ConcreteDtoBase } from '../../../../shared/base-class/dto-base';
import { CatalogDetailDto } from '../../common/dto/catalog-detail.dto';
import { StageProcessDto } from '../../common/dto/stage-process.dto';
import { BudgetShipmentBasicDto } from './budget-shipment.dto';
import { CurReviewDto } from './cur-review.dto';
import { DocumentaryReviewBasicDto } from './documentary-review.dto';
import { MedicalControlBasicDto } from './medical-control.dto';
import { PaymentShipmentBasicDto } from './payment-shipment.dto';
import { ProviderDto } from './provider.dto';
import { TariffControlBasicDto } from './tariff-control.dto';

export class ProcessBasicDto extends OmitType(ConcreteDtoBase, ['createdAt']) {
  @Expose()
  @ApiProperty({ example: 1, description: 'Identificador único del trámite' })
  id: number;

  @Expose()
  @ApiProperty({ example: 1, description: 'Identificador del prestador' })
  providerId: number;

  @Expose()
  @ApiProperty({ example: 'TRM-001', description: 'Número del trámite' })
  caseNumber: string;

  @Expose()
  @ApiProperty({ example: true, description: 'Indica si el trámite es catastrófico' })
  isCatastrophic: boolean;

  @Expose()
  @ApiProperty({ example: 1234, description: 'Cantidad de expedientes' })
  fileCount: number;

  @Expose()
  @ApiProperty({ example: 5, description: 'Mes de prestación' })
  serviceMonth: number;

  @Expose()
  @ApiProperty({ example: 2023, description: 'Año de prestación' })
  serviceYear: number;

  @Expose()
  @ApiProperty({ example: true, description: 'Indica si el trámite tiene archivo' })
  hasFile: boolean;

  @Expose()
  @ApiProperty({ example: 12345.67, description: 'Valor solicitado' })
  requestedAmount: number;

  @Expose()
  @ApiProperty({ example: 1, description: 'Identificador del tipo de ingreso' })
  entryTypeId: number;

  @Expose()
  @ApiProperty({ example: 2, description: 'Identificador del número de ingreso' })
  entryNumberId: number;

  @Expose()
  @ApiProperty({ example: 3, description: 'Número de caja' })
  boxNumber: number;

  @Expose()
  @ApiProperty({ example: 'Observaciones del trámite', description: 'Observaciones del trámite', maxLength: 2500 })
  observations?: string;

  @Expose()
  @ApiProperty({ example: 'AB', description: 'Iniciales del usuario' })
  userInitials: string;

  @Expose()
  @ApiProperty({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de recepción del trámite' })
  receptionDate: string;

  @Expose()
  @ApiProperty({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de segunda recepción del trámite' })
  secondReceptionDate: string;

  @Expose()
  @ApiProperty({ example: 1, description: 'Identificador de la etapa actual' })
  currentStageId: number;

  @Expose()
  @ApiProperty({ example: new Date(), description: 'Fecha de la etapa actual' })
  currentStageDate: Date;

  @Expose()
  @ApiProperty({ example: 2, description: 'Identificador de la etapa de retorno' })
  returnStageId: number;

  @Expose()
  @ApiProperty({ example: new Date(), description: 'Fecha de la etapa de retorno' })
  returnStageDate: Date;

  @Expose()
  @ApiProperty({ example: 'Motivo de retorno', description: 'Motivo de retorno' })
  returnStageReason: string;

  @Expose()
  @ApiProperty({ example: true, description: 'Indica si el trámite de retorno fue aprobado' })
  returnApproved: boolean;

  @Expose()
  @ApiProperty({ example: 1, description: 'Identificador del estado' })
  statusId: number;

  @Expose()
  @ApiProperty({ example: true, description: 'Indica si el trámite fue rechazado' })
  rejected: boolean;

  @Expose()
  @ApiProperty({ example: '1724605020', description: 'Identificador del usuario de retorno' })
  returnStageBy: string;

  @Expose()
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del usuario de retorno' })
  returnStageByName: string;

  @Expose()
  @ApiProperty({ example: 'Motivo de rechazo de aprobación de retorno', description: 'Motivo de rechazo de aprobación de retorno' })
  returnApprovalRejectionReason: string;

  @Expose()
  @ApiProperty({ example: new Date(), description: 'Fecha de creación del trámite' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del usuario de creación' })
  createdByName: string;

  @Expose()
  @ApiProperty({ example: 'JP', description: 'Iniciales del usuario de creación' })
  createdByUserInitials: string;
}

export class ProcessDto extends ProcessBasicDto {
  @Expose()
  @ApiProperty({ type: CatalogDetailDto, description: 'Detalle del tipo de ingreso' })
  @Expose()
  @Type(() => CatalogDetailDto)
  entryType: CatalogDetailDto;

  @Expose()
  @ApiProperty({ type: CatalogDetailDto, description: 'Detalle del número de ingreso' })
  @Expose()
  @Type(() => CatalogDetailDto)
  entryNumber: CatalogDetailDto;

  @Expose()
  @ApiProperty({ type: ProviderDto, description: 'Prestador' })
  @Type(() => ProviderDto)
  provider: ProviderDto;

  @Expose()
  @ApiProperty({ type: StageProcessDto, description: 'Detalle del estado actual' })
  @Type(() => StageProcessDto)
  currentStage: StageProcessDto;

  @Expose()
  @ApiProperty({ type: StageProcessDto, description: 'Detalle del estado de retorno' })
  @Type(() => StageProcessDto)
  returnStage: StageProcessDto;

  @Expose()
  @ApiProperty({ type: CatalogDetailDto, description: 'Detalle del estado' })
  @Type(() => CatalogDetailDto)
  status: CatalogDetailDto;

  @Expose()
  @ApiProperty({ type: () => DocumentaryReviewBasicDto, description: 'Revisión documental' })
  @Type(() => DocumentaryReviewBasicDto)
  documentaryReview: DocumentaryReviewBasicDto;

  @Expose()
  @ApiProperty({ type: () => MedicalControlBasicDto, description: 'Control médico' })
  @Type(() => MedicalControlBasicDto)
  medicalControl: MedicalControlBasicDto;

  @Expose()
  @ApiProperty({ type: () => TariffControlBasicDto, description: 'Control tarifario' })
  @Type(() => TariffControlBasicDto)
  tariffControl: TariffControlBasicDto;

  @Expose()
  @ApiProperty({ type: () => BudgetShipmentBasicDto, description: 'Envío de presupuesto' })
  @Type(() => BudgetShipmentBasicDto)
  budgetShipment: BudgetShipmentBasicDto;

  @Expose()
  @ApiProperty({ type: () => PaymentShipmentBasicDto, description: 'Envío a pago' })
  @Type(() => PaymentShipmentBasicDto)
  paymentShipment: PaymentShipmentBasicDto;

  @Expose()
  @ApiProperty({ type: () => CurReviewDto, description: 'CUR por disparar' })
  @Type(() => CurReviewDto)
  curReview: CurReviewDto;
}
