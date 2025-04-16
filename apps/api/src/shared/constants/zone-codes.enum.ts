export const CONSTANTS_ZONES = {
  ZONE_1: { CODE: 'Z01', NAME: 'ZONA 1', UNICODIGO: '003824' },
  ZONA_2: { CODE: 'Z02', NAME: 'ZONA 2', UNICODIGO: '003825' },
  ZONE_3: { CODE: 'Z03', NAME: 'ZONA 3', UNICODIGO: '003826' },
  ZONE_4: { CODE: 'Z04', NAME: 'ZONA 4', UNICODIGO: '003827' },
  ZONE_5: { CODE: 'Z05', NAME: 'ZONA 5', UNICODIGO: '003828' },
  ZONE_6: { CODE: 'Z06', NAME: 'ZONA 6', UNICODIGO: '003829' },
  ZONE_7: { CODE: 'Z07', NAME: 'ZONA 7', UNICODIGO: '003830' },
  ZONE_8: { CODE: 'Z08', NAME: 'ZONA 8', UNICODIGO: '003831' },
  ZONE_9: { CODE: 'Z09', NAME: 'ZONA 9', UNICODIGO: '003832' },
};

export const getZoneUnicodigos = (): string[] => {
  return Object.values(CONSTANTS_ZONES).map((zone) => zone.UNICODIGO);
};

export enum ZoneCodesEnum {
  ZONE_1 = 'Z01',
  ZONE_2 = 'Z02',
  ZONE_3 = 'Z03',
  ZONE_4 = 'Z04',
  ZONE_5 = 'Z05',
  ZONE_6 = 'Z06',
  ZONE_7 = 'Z07',
  ZONE_8 = 'Z08',
  ZONE_9 = 'Z09',
}
