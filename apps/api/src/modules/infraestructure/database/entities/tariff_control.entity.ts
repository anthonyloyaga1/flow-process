import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { EntityBase } from '../../../../shared/base-class/entity-base';
import { ProcessEntity } from './process.entity';

@Entity('tariff_controls')
export class TariffControlEntity extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  processId: number;

  @Column({ type: 'timestamp', nullable: true })
  currentStageStartDate: Date;

  @Column({ type: 'date', nullable: false })
  liquidationStartDate: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  approvedValue: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  objectedValue: number;

  @Column({ type: 'text', nullable: true })
  delayReason?: string;

  @Column({ type: 'int', nullable: true })
  objectedFilesCount?: number;

  @Column({ type: 'date', nullable: true })
  filesDeliveryDate?: string;

  @Column({ type: 'int', nullable: true })
  objectedFilesCountACFSS?: number;

  @Column({ type: 'text', nullable: true })
  objectedFilesDetails?: string;

  @Column({ type: 'date', nullable: false })
  documentManagementSendDate: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  reportNumber: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  memorandumNumber: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  documentManagementResponsibleIdentifier: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  documentManagementResponsibleName: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  createdByName: string;

  @Column({ type: 'varchar', length: 15, nullable: false })
  createdByInitials: string;

  @OneToOne(() => ProcessEntity, (process) => process.tariffControl)
  @JoinColumn()
  process: ProcessEntity;
}
