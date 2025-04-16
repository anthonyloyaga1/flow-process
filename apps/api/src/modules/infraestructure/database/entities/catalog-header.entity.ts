import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { EntityBase } from '../../../../shared/base-class/entity-base';
import { CatalogDetailEntity } from './catalog-detail.entity';

@Entity('catalog_header')
export class CatalogHeaderEntity extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  description: string;

  @OneToMany(() => CatalogDetailEntity, (detalle) => detalle.catalogHeader)
  catalogDetail: CatalogDetailEntity[];
}
