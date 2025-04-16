import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PersonSoapDomService } from '../../../domain/common/services/person-soap.dom.service';
import { PersonSoapDto } from '../dto/person-soap.dto';

@Injectable()
export class PersonSoapService {
  constructor(private readonly personSoapRepository: PersonSoapDomService) {}

  async getPersonData(nui: string) {
    const personData = await this.personSoapRepository.getPersonData(nui);
    return plainToInstance(PersonSoapDto, personData, { excludeExtraneousValues: true });
  }
}
