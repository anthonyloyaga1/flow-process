import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { EntityBase } from '../../../../shared/base-class/entity-base';
import { CatalogHeaderEntity } from './catalog-header.entity';

@Entity('catalog_detail')
export class CatalogDetailEntity extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'int', nullable: true })
  numericValue: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  characterValue: string;

  @Column({ type: 'number', nullable: true })
  catalogHeaderId: number;

  @ManyToOne(() => CatalogHeaderEntity, (cabecera) => cabecera.catalogDetail)
  catalogHeader: CatalogHeaderEntity;
}
