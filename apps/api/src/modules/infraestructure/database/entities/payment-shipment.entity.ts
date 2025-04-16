import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { EntityBase } from '../../../../shared/base-class/entity-base';
import { ProcessEntity } from './process.entity';

@Entity('payment_shipments')
export class PaymentShipmentEntity extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  processId: number;

  @Column({ type: 'timestamp', nullable: true })
  currentStageStartDate: Date;

  @Column({ type: 'date', nullable: false })
  paymentShipmentDate: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  fileResponsibleIdentifier: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  fileResponsibleName: string;

  @Column({ type: 'date', nullable: false })
  fileShipmentDate: string;

  @Column({ type: 'text', nullable: true })
  observations?: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  createdByName: string;

  @Column({ type: 'varchar', length: 15, nullable: false })
  createdByInitials: string;

  @OneToOne(() => ProcessEntity, (process) => process.paymentShipment)
  @JoinColumn()
  process: ProcessEntity;
}
