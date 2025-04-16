import { Injectable } from '@nestjs/common';

import { Client } from '../../../../domain/common/models/client';
import { urlSearchClients } from '../services/keycloak-api.endpoints';
import { KeycloakApiService } from '../services/keycloak-api.service';

@Injectable()
export class ClientApiRepository {
  constructor(private readonly httpClientService: KeycloakApiService) {}

  async findOneClientByClientId(realm: string, clientId: string) {
    const url = urlSearchClients(realm, clientId);
    const response = await this.httpClientService.get<Client[]>({ url });
    if (!response.data || response.data.length <= 0) return null;
    return response.data[0];
  }
}
