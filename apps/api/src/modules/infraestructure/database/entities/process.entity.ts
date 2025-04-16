import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { EntityBase } from '../../../../shared/base-class/entity-base';
import { BudgetShipmentEntity } from './budget-shipment.entity';
import { CatalogDetailEntity } from './catalog-detail.entity';
import { CurReviewEntity } from './cur-review.entity';
import { DocumentaryReviewEntity } from './documentary-review.entity';
import { MedicalControlEntity } from './medical-control.entity';
import { PaymentShipmentEntity } from './payment-shipment.entity';
import { ProviderEntity } from './provider.entity';
import { StageProcessEntity } from './stage_process.entity';
import { TariffControlEntity } from './tariff_control.entity';

@Entity('processes')
export class ProcessEntity extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  providerId: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  caseNumber: string;

  @Column({ type: 'boolean', nullable: true })
  isCatastrophic: boolean;

  @Column({ type: 'int', nullable: false })
  fileCount: number;

  @Column({ type: 'int', nullable: false })
  serviceMonth: number;

  @Column({ type: 'int', nullable: true })
  serviceYear: number;

  @Column({ type: 'boolean', nullable: true })
  hasFile: boolean;

  @Column({
    type: 'numeric',
    precision: 9,
    scale: 2,
    nullable: false,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  requestedAmount: number;

  @Column({ type: 'int', nullable: true })
  entryTypeId: number;

  @Column({ type: 'int', nullable: true })
  entryNumberId: number;

  @Column({ type: 'int', nullable: true })
  boxNumber: number;

  @Column({ type: 'varchar', length: 2500, nullable: true })
  observations: string;

  @Column({ type: 'varchar', length: 15, nullable: false })
  createdByUserInitials: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  createdByName: string;

  @Column({ type: 'date', nullable: false })
  receptionDate: string;

  @Column({ type: 'date', nullable: true })
  secondReceptionDate: string;

  @Column({ type: 'int', nullable: false })
  currentStageId: number;

  @Column({ type: 'timestamp', nullable: false })
  currentStageDate: Date;

  @Column({ type: 'int', nullable: true })
  returnStageId: number;

  @Column({ type: 'timestamp', nullable: true })
  returnStageDate: Date;

  @Column({ type: 'text', nullable: true })
  returnStageReason: string;

  @Column({ type: 'boolean', nullable: false })
  returnApproved: boolean;

  @Column({ type: 'int', nullable: true })
  statusId: number;

  @Column({ type: 'boolean', nullable: false })
  rejected: boolean;

  @Column({ type: 'varchar', length: 15, nullable: true })
  returnStageBy: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  returnStageByName: string;

  @Column({ type: 'text', nullable: true })
  returnApprovalRejectionReason: string;

  @ManyToOne(() => ProviderEntity, (provider) => provider.id)
  provider: ProviderEntity;

  @ManyToOne(() => CatalogDetailEntity, (catalogoDetalle) => catalogoDetalle.id)
  entryType: CatalogDetailEntity;

  @ManyToOne(() => CatalogDetailEntity, (catalogoDetalle) => catalogoDetalle.id)
  entryNumber: CatalogDetailEntity;

  @ManyToOne(() => StageProcessEntity, (statusProcess) => statusProcess.id)
  currentStage: StageProcessEntity;

  @ManyToOne(() => StageProcessEntity, (statusProcess) => statusProcess.id)
  returnStage: StageProcessEntity;

  @ManyToOne(() => CatalogDetailEntity, (catalogoDetalle) => catalogoDetalle.id)
  status: CatalogDetailEntity;

  @OneToOne(() => DocumentaryReviewEntity, (documentaryReview) => documentaryReview.process)
  documentaryReview: DocumentaryReviewEntity;

  @OneToOne(() => MedicalControlEntity, (medicalControl) => medicalControl.process)
  medicalControl: MedicalControlEntity;

  @OneToOne(() => TariffControlEntity, (tariffControl) => tariffControl.process)
  tariffControl: TariffControlEntity;

  @OneToOne(() => BudgetShipmentEntity, (budgetShipment) => budgetShipment.process)
  budgetShipment: BudgetShipmentEntity;

  @OneToOne(() => PaymentShipmentEntity, (paymentShipment) => paymentShipment.process)
  paymentShipment: PaymentShipmentEntity;

  @OneToOne(() => CurReviewEntity, (curReview) => curReview.process)
  curReview: CurReviewEntity;

  @BeforeUpdate()
  updateTimestamp() {
    this.modifiedAt = new Date();
  }

  @BeforeInsert()
  insertTimestamp() {
    this.createdAt = new Date();
  }
}
