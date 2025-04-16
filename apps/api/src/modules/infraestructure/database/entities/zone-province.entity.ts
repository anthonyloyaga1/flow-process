import { EntityBase } from '../../../../shared/base-class/entity-base';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ProvinceEntity } from './province.entity';
import { OrganizationEntity } from './organization.entity';

@Entity('zone_province')
export class ZoneProvinceEntity extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrganizationEntity, (zone) => zone.zoneProvinces)
  @JoinColumn({ name: 'zone_id' })
  zone: OrganizationEntity;

  @ManyToOne(() => ProvinceEntity, (province) => province.zoneProvinces)
  @JoinColumn({ name: 'province_id' })
  province: ProvinceEntity;
}
