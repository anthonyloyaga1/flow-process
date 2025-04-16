import { HttpException, Injectable } from '@nestjs/common';

import { ErrorMessage } from '../../../../../shared/constants/error-messages';
import { PersonaSoapAdapter } from '../adapters/persona.soap.adapter';
import { generarNombreApellidoDesdeNombreCompleto } from '../helpers/names.helper';
import { RegistroCivilSoapService } from '../providers/registro-civil-soap.service';

@Injectable()
export class PersonaSoapRepository {
  constructor(private readonly registroCivilSoapService: RegistroCivilSoapService) {}

  /**
   * Retorna  los datos requeridos para crear un usuario en el keycloak
   * @param nui  cédula
   * @returns
   */
  async busquedaPersonaPorNui(nui: string) {
    try {
      const data = await this.registroCivilSoapService.soapBusquedaPorNui(nui);
      if (!data.return) throw new Error(data['data']);
      if (data.return.CodigoMensaje === '-001') throw new Error(data.return.Mensaje);
      const nombresPersona = generarNombreApellidoDesdeNombreCompleto(data.return.Ciudadano.Nombre);
      return PersonaSoapAdapter(data.return.Ciudadano, nombresPersona);
    } catch (error) {
      throw new HttpException(ErrorMessage.ERROR_SOAP.MSG, ErrorMessage.ERROR_SOAP.CODE, { cause: error });
    }
  }
}
