export interface MapperDto {
  asDto(source: any): any;
  asDtoList?(source: any[]): any[];
  asEntityCreate?(source: any, user?: any): any;
  asEntityUpdate?(source: any, id: number, user?: any): any;
  asEntityList?(source: any[]): any[];
}
