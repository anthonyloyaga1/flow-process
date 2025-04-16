import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AccessRulesApiRepository } from './keycloak/repositories/access-rules.api.repository';
import { ClientApiRepository } from './keycloak/repositories/client.api.repository';
import { KeycloakApiService } from './keycloak/services/keycloak-api.service';

@Module({
  imports: [HttpModule],
  providers: [KeycloakApiService, AccessRulesApiRepository, ClientApiRepository],
  exports: [AccessRulesApiRepository, ClientApiRepository],
})
export class RacApiModule {}
