import { ConfigModule, ConfigService } from '@nestjs/config';
import { KeycloakConnectOptions } from 'nest-keycloak-connect';

ConfigModule.forRoot({ envFilePath: '.env' });
const configService = new ConfigService();

export const keycloakConnectOptions: KeycloakConnectOptions = {
  authServerUrl: configService.get('KC_AUTHSERVERURL'),
  realm: configService.get('KC_REALM'),
  clientId: configService.get('KC_CLIENTID'),
  secret: configService.get('KC_SECRET'),
  bearerOnly: false,
  'ssl-required': 'external',
  'confidential-port': 0,
  useNestLogger: true,
};
