import { Column } from 'typeorm';

export abstract class EntityBase {
  @Column({ type: 'varchar', length: 100, nullable: false })
  createdBy: string;

  @Column({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  modifiedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  modifiedAt: Date;

  @Column({ type: 'boolean', default: true, nullable: false })
  active: boolean;
}
