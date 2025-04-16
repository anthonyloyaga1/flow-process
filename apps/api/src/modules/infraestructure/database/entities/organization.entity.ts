import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { ZoneProvinceEntity } from './zone-province.entity';

@Entity('organization')
export class OrganizationEntity {
  @PrimaryColumn('int', { name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'identifier', nullable: false })
  identifier: string;

  @Column({ type: 'varchar', name: 'organizationname', length: 300, nullable: false })
  organizationName: string;

  @Column({ type: 'varchar', name: 'alias', length: 180, nullable: false })
  alias: string;

  @Column({ type: 'varchar', name: 'organizationtype', nullable: false })
  organizationType: string;

  @Column({ type: 'varchar', name: 'contact', nullable: false })
  contact: string;

  @Column({ type: 'varchar', name: 'organizationlocation', nullable: false })
  organizationLocation: string;

  @Column({ type: 'smallint', name: 'ec_typeentityid', nullable: true })
  ecTypeEntityId: number;

  @Column({ type: 'varchar', name: 'ec_typeentityname', length: 100, nullable: true })
  ecTypeEntityName: string;

  @Column({ type: 'smallint', name: 'ec_levelid', nullable: true })
  ecLevelId: number;

  @Column({ type: 'varchar', name: 'ec_levelname', length: 100, nullable: true })
  ecLevelName: string;

  @Column({ type: 'smallint', name: 'ec_typologyid', nullable: true })
  ecTypologyId: number;

  @Column({ type: 'varchar', name: 'ec_typologyname', length: 100, nullable: true })
  ecTypologyName: string;

  @Column({ type: 'smallint', name: 'ec_institutionid', nullable: true })
  ecInstitutionId: number;

  @Column({ type: 'varchar', name: 'ec_institutionname', length: 50, nullable: true })
  ecInstitutionName: string;

  @Column({ type: 'smallint', name: 'ec_provinceid', nullable: true })
  ecProvinceId: number;

  @Column({ type: 'varchar', name: 'ec_provincecode', length: 6, nullable: true })
  ecProvinceCode: string;

  @Column({ type: 'varchar', name: 'ec_provincename', length: 100, nullable: true })
  ecProvinceName: string;

  @Column({ type: 'smallint', name: 'ec_cantonid', nullable: true })
  ecCantonId: number;

  @Column({ type: 'varchar', name: 'ec_cantoncode', length: 6, nullable: true })
  ecCantonCode: string;

  @Column({ type: 'varchar', name: 'ec_cantonname', length: 100, nullable: true })
  ecCantonName: string;

  @Column({ type: 'smallint', name: 'ec_parishid', nullable: true })
  ecParishId: number;

  @Column({ type: 'varchar', name: 'ec_parishcode', length: 6, nullable: true })
  ecParishCode: string;

  @Column({ type: 'varchar', name: 'ec_parishname', length: 100, nullable: true })
  ecParishName: string;

  @Column({ type: 'smallint', name: 'ec_zoneid', nullable: true })
  ecZoneId: number;

  @Column({ type: 'varchar', name: 'ec_zonecode', length: 6, nullable: true })
  ecZoneCode: string;

  @Column({ type: 'varchar', name: 'ec_zonedistribution', length: 100, nullable: true })
  ecZoneDistribution: string;

  @Column({ type: 'varchar', name: 'ec_zonename', length: 100, nullable: true })
  ecZoneName: string;

  @Column({ type: 'smallint', name: 'ec_districtid', nullable: true })
  ecDistrictId: number;

  @Column({ type: 'varchar', name: 'ec_districtcode', length: 6, nullable: true })
  ecDistrictCode: string;

  @Column({ type: 'varchar', name: 'ec_districtdistribution', length: 250, nullable: true })
  ecDistrictDistribution: string;

  @Column({ type: 'smallint', name: 'ec_permissionstatus', nullable: false })
  ecPermissionStatus: number;

  @Column({ type: 'timestamp', name: 'ec_updatedat', nullable: false })
  ecUpdatedAt: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'creationdate', default: () => 'CURRENT_TIMESTAMP' })
  creationDate: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'modificationdate', nullable: true })
  modificationDate: Date;

  @Column({ type: 'uuid', name: 'usercreation_id', nullable: false })
  userCreationId: string;

  @Column({ type: 'uuid', name: 'usermodification_id', nullable: true })
  userModificationId: string;

  @Column({ type: 'boolean', name: 'active', default: true, nullable: true })
  active: boolean;

  @OneToMany(() => ZoneProvinceEntity, (zone) => zone.zone)
  zoneProvinces: ZoneProvinceEntity[];
}
