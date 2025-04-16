import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'nestjs-soap';

import { RegistroCivilInfo } from '../interfaces/registro-civil-info.interface';

@Injectable()
export class RegistroCivilSoapService {
  constructor(@Inject('RC_SOAP_CLIENT') private readonly rcSoapClient: Client) {}

  soapBusquedaPorNui(nui: string) {
    return new Promise<RegistroCivilInfo>((resolve, reject) => {
      return this.rcSoapClient.BusquedaPorNui({ NUI: nui }, async function (_err: any, result: RegistroCivilInfo) {
        if (result) resolve(result);
        else reject(new Error('Error in soapBusquedaPorNui'));
      });
    });
  }
}
