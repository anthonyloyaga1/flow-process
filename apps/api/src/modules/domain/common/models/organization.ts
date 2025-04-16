import { Province } from './province';

export class Organization {
  id: number;
  identifier: string;
  organizationName: string;
  alias: string;
  organizationType: string;
  contact: string;
  organizationLocation: string;
  ecTypeEntityId: number;
  ecTypeEntityName: string;
  ecLevelId: number;
  ecLevelName: string;
  ecTypologyId: number;
  ecTypologyName: string;
  ecInstitutionId: number;
  ecInstitutionName: string;
  ecProvinceId: number;
  ecProvinceCode: string;
  ecProvinceName: string;
  ecCantonId: number;
  ecCantonCode: string;
  ecCantonName: string;
  ecParishId: number;
  ecParishCode: string;
  ecParishName: string;
  ecZoneId: number;
  ecZoneCode: string;
  ecZoneDistribution: string;
  ecZoneName: string;
  ecDistrictId: number;
  ecDistrictCode: string;
  ecDistrictDistribution: string;
  ecPermissionStatus: number;
  ecUpdatedAt: Date;
  creationDate: Date;
  modificationDate: Date;
  userCreationId: string;
  userModificationId: string;
  active: boolean;

  zoneProvinces: Province[];
}
