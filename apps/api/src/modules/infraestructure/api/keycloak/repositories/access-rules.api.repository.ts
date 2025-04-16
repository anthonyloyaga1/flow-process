import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import { AccessRules } from '../../../../domain/common/models/access-rules';
import { Settings } from '../../../../domain/common/models/settings';
import { urlGetSettings } from '../services/keycloak-api.endpoints';
import { KeycloakApiService } from '../services/keycloak-api.service';

@Injectable()
export class AccessRulesApiRepository {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly keycloakApi: KeycloakApiService,
  ) {}

  async findAccessRulesByRoleName(realm: string, clientName: string, clientUuid: string): Promise<AccessRules> {
    const cacheKey = `access-rules-${clientUuid}`;
    const cachedAccessRules = await this.cacheManager.get<AccessRules>(cacheKey);
    let accessRules = cachedAccessRules ? new AccessRules(cachedAccessRules) : null;

    if (!accessRules) {
      accessRules = await this.getAccessRules(realm, clientName, clientUuid);
      await this.cacheManager.set(cacheKey, accessRules, 20000); // TTL 20s
    }

    return accessRules;
  }

  private async getAccessRules(realm: string, clientName: string, clientUuid: string): Promise<AccessRules> {
    const url = urlGetSettings(realm, clientUuid);
    const response = await this.keycloakApi.get<Settings>({ url });
    return new AccessRules({ realm, clientName, clientUuid, settings: response.data });
  }
}
