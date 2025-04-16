import { Exclude } from 'class-transformer';

export abstract class DtoBase {
  @Exclude()
  createdBy: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  modifiedBy: string;

  @Exclude()
  modifiedAt: Date;

  @Exclude()
  active: boolean;
}

export class ConcreteDtoBase extends DtoBase {}
