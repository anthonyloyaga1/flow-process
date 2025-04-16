import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { EntityBase } from '../../../../shared/base-class/entity-base';
import { ProviderGroupEntity } from './provider-group';

@Entity('providers')
export class ProviderEntity extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  unicode: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  ruc: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  denomination: string;

  @Column({ type: 'varchar', length: 5, nullable: true })
  provinceCode: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  provinceDescription: string;

  @Column({ type: 'varchar', length: 5, nullable: true })
  zoneCode: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  zoneDescription: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  attentionLevel: string;

  @Column({ type: 'int', nullable: true })
  providerGroupId: number;

  @ManyToOne(() => ProviderGroupEntity, (providerGroup) => providerGroup.id)
  providerGroup: ProviderGroupEntity;

  @BeforeUpdate()
  updateTimestamp() {
    this.modifiedAt = new Date();
  }

  @BeforeInsert()
  insertTimestamp() {
    this.createdAt = new Date();
  }
}
