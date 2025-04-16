import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { EntityBase } from '../../../../shared/base-class/entity-base';
import { ProcessEntity } from './process.entity';

@Entity('budget_shipments')
export class BudgetShipmentEntity extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  processId: number;

  @Column({ type: 'timestamp', nullable: true })
  currentStageStartDate: Date;

  @Column({ type: 'date', nullable: false })
  budgetRequestDate: string;

  @Column({ type: 'text', nullable: true })
  observations?: string;

  @Column({ type: 'date', nullable: false })
  invoiceRequestDate: string;

  @Column({ type: 'date', nullable: false })
  invoiceDeliveryDate: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  invoiceNumber: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  createdByName: string;

  @Column({ type: 'varchar', length: 15, nullable: false })
  createdByInitials: string;

  @OneToOne(() => ProcessEntity, (process) => process.budgetShipment)
  @JoinColumn()
  process: ProcessEntity;
}
