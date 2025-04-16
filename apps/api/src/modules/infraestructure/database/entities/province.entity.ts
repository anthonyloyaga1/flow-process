import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { EntityBase } from '../../../../shared/base-class/entity-base';
import { ZoneProvinceEntity } from './zone-province.entity';

@Entity('province')
export class ProvinceEntity extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 2, nullable: false })
  code: string;

  @OneToMany(() => ZoneProvinceEntity, (zoneProvince) => zoneProvince.province)
  zoneProvinces: ZoneProvinceEntity[];
}
