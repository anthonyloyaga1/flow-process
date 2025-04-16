import { HttpException, Injectable } from '@nestjs/common';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { PersonaSoapRepository } from '../../../infraestructure/soap/registro-civil/repositories/persona.soap.repository';

@Injectable()
export class PersonSoapDomService {
  constructor(private readonly personSoapRepository: PersonaSoapRepository) {}

  async getPersonData(nui: string) {
    const person = await this.personSoapRepository.busquedaPersonaPorNui(nui);
    if (!person) throw new HttpException(ErrorMessage.SOAP_PERSON_NOT_FOUND.MSG, ErrorMessage.SOAP_PERSON_NOT_FOUND.CODE);
    return person;
  }
}
