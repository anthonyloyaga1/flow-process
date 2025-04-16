import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { EntityBase } from '../../../../shared/base-class/entity-base';

@Entity('report_types')
export class ReportTypeEntity extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text' })
  description: string;
}
