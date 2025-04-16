import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { EntityBase } from '../../../../shared/base-class/entity-base';
import { ProcessEntity } from './process.entity';

@Entity('medical_controls')
export class MedicalControlEntity extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  processId: number;

  @Column({ type: 'timestamp', nullable: true })
  currentStageStartDate: Date;

  @Column({ type: 'date', nullable: false })
  startDate: string;

  @Column({ type: 'text', nullable: true })
  delayReason: string;

  @Column({ type: 'text', nullable: true })
  objectedPatientsDetails: string;

  @Column({ type: 'int', nullable: true })
  objectedFilesCount: number;

  @Column({ type: 'date', nullable: true })
  filesDeliveryDate: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  createdByName: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  createdByInitials: string;

  @OneToOne(() => ProcessEntity, (process) => process.medicalControl)
  @JoinColumn()
  process: ProcessEntity;

  @BeforeUpdate()
  updateTimestamp() {
    this.modifiedAt = new Date();
  }

  @BeforeInsert()
  insertTimestamp() {
    this.createdAt = new Date();
  }
}
