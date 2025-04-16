import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { EntityBase } from '../../../../shared/base-class/entity-base';
import { CatalogDetailEntity } from './catalog-detail.entity';

@Entity('provider_groups')
export class ProviderGroupEntity extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'int', nullable: true })
  providerGroupAggregatedId: number;

  @ManyToOne(() => CatalogDetailEntity, (catalogDetail) => catalogDetail.id)
  providerGroupAggregated: CatalogDetailEntity;
}
