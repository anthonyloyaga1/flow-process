import { TokenInfo } from '../interfaces/token-info.interface';

export interface Metadata {
  user?: TokenInfo;
  reqId?: string;
  extra?: any;
  [key: string]: any;
}

export class RequestBase<T> {
  body: T;
  metadata?: Metadata;
}
