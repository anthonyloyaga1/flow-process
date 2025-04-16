import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { TokenInfo } from '../../../../shared/interfaces/token-info.interface';
import { AccessRulesApiRepository } from '../../../infraestructure/api/keycloak/repositories/access-rules.api.repository';
import { ClientApiRepository } from '../../../infraestructure/api/keycloak/repositories/client.api.repository';

export interface AuthorizationContext {
  roleName: string;
  user: TokenInfo;
}

@Injectable()
export class AccessRulesDomService {
  private readonly clientName: string;
  private readonly realm: string;

  constructor(
    private readonly accessRulesRepository: AccessRulesApiRepository,
    private readonly clientRepository: ClientApiRepository,
    private readonly configService: ConfigService,
  ) {
    this.realm = this.configService.get<string>('KC_REALM') || 'msp-nacional';
    this.clientName = this.configService.get<string>('KC_CLIENTID') || 'api-rac';
  }

  async findAccessRulesByRoleName({ roleName, user }: AuthorizationContext) {
    //Obtener del token el rol del usuario
    const rolesInToken = user.resource_access[this.clientName].roles;
    //Validar que el rol del usuario este en la lista de roles del token
    const clientRoleName = rolesInToken.find((role) => role == roleName);

    // Si no se encuentra el rol del usuario en la lista de roles del token, se lanza una excepción
    if (!clientRoleName) throw new HttpException(`${ErrorMessage.ACCESS_RULES_NOT_FOUND.MSG} ${roleName}`, ErrorMessage.ACCESS_RULES_NOT_FOUND.CODE);

    //Obtener el cliente por el nombre
    const client = await this.clientRepository.findOneClientByClientId(this.realm, this.clientName);
    if (!client) throw new HttpException(ErrorMessage.CLIENT_NOT_FOUND.MSG, ErrorMessage.CLIENT_NOT_FOUND.CODE);

    //Obtener las reglas de acceso por el nombre del cliente
    const accessRules = await this.accessRulesRepository.findAccessRulesByRoleName(this.realm, this.clientName, client.id);
    //Filtrar las reglas de acceso por el rol del usuario
    await accessRules.filterSimpleAccessRulesForRoles([clientRoleName]);

    return accessRules;
  }
}
