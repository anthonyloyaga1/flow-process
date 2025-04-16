import { StateEnum } from '../constants/state.enum';

export interface JSend {
  status: StateEnum;
  code?: number;
  data?: any;
  message?: string;
}
