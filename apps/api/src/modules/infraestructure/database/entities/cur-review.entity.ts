import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { EntityBase } from '../../../../shared/base-class/entity-base';
import { ProcessEntity } from './process.entity';
import { CatalogDetailEntity } from './catalog-detail.entity';

@Entity('cur_reviews')
export class CurReviewEntity extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  processId: number;

  @Column({ type: 'timestamp', nullable: true })
  currentStageStartDate: Date;

  @Column({ type: 'int', nullable: false })
  curNumber: number;

  @Column({ type: 'date', nullable: false })
  curDate: string;

  @Column({ type: 'int', nullable: false })
  statusCurId: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  zoneCoordinatorIdentifier: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  zoneCoordinatorName: string;

  @Column({ type: 'text', nullable: true })
  observations?: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  createdByName: string;

  @Column({ type: 'varchar', length: 15, nullable: false })
  createdByInitials: string;

  @OneToOne(() => ProcessEntity, (process) => process.curReview)
  @JoinColumn()
  process: ProcessEntity;

  @ManyToOne(() => CatalogDetailEntity, (catalogoDetalle) => catalogoDetalle.id)
  statusCur: CatalogDetailEntity;
}
