import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Scopes } from 'nest-keycloak-connect';

import { PersonSoapService } from '../services/person-soap.service';

@ApiBearerAuth()
@ApiTags('Common (recursos comunes)')
@Controller('common/person-soap')
export class PersonSoapController {
  constructor(private readonly personSoapService: PersonSoapService) {}

  @Scopes()
  @Get(':nui')
  getPersonDataByNui(@Param('nui') nui: string) {
    return this.personSoapService.getPersonData(nui);
  }
}
