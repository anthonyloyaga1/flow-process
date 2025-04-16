import { ConfigModule, ConfigService } from '@nestjs/config';

ConfigModule.forRoot({ envFilePath: '.env' });
const config = new ConfigService();

//Generación de token
export const kcServer = config.get('KC_AUTHSERVERURL');

export const urlGetToken = (realm: string) => `${kcServer}realms/${realm}/protocol/openid-connect/token`;

//Apis GET de administración general de reino
export const urlBaseAdmin = (realm: string) => `${config.get('KC_AUTHSERVERURL')}admin/realms/${realm}`;
export const urlGetClients = (realm: string) => `${urlBaseAdmin(realm)}/clients`;
export const urlSearchClients = (realm: string, clientId: string) => `${urlBaseAdmin(realm)}/clients?clientId=${clientId}`;
export const urlGetRealmRoles = (realm: string) => `${urlBaseAdmin(realm)}/roles`;
export const urlGetRealmRoleById = (realm: string) => `${urlBaseAdmin(realm)}/roles-by-id`;
export const urlGetGroups = (realm: string) => `${urlBaseAdmin(realm)}/groups`;
export const urlGetGroupById = (realm: string, id: string) => `${urlBaseAdmin(realm)}/groups/${id}`;
export const urlGetGroupsByUserId = (realm: string, userId: string) => `${urlBaseAdmin(realm)}/users/${userId}/groups`;
export const urlGetUser = (realm: string) => `${urlBaseAdmin(realm)}/users`;
export const urlGetUserById = (realm: string, id: string) => `${urlBaseAdmin(realm)}/users/${id}`;

//Apis Post de administracion general de reino
export const urlPostGroups = (realm: string) => urlGetGroups(realm);
export const urlPostRealmRoles = (realm: string) => urlGetRealmRoles(realm);
export const urlPostUser = (realm: string) => urlGetUser(realm);

//Apis Put de administracion general de reino
export const urlPutUser = (realm: string, id: string) => urlGetUserById(realm, id);
export const urlPutGroupsInUser = (realm: string, id: string, groupId: string) => `${urlGetUserById(realm, id)}/groups/${groupId}`;
export const urlDeleteGroupsInUser = (realm: string, id: string, groupId: string) => urlPutGroupsInUser(realm, id, groupId);
export const urlDeleteUser = (realm: string, id: string) => urlGetUserById(realm, id);

//Apis GET de autorización de un cliente
export const urlClientBase = (realm: string, clientUuid: string) => `${config.get('KC_AUTHSERVERURL')}admin/realms/${realm}/clients/${clientUuid}`;
export const urlAccessBase = (realm: string, clientUuid: string) => `${urlClientBase(realm, clientUuid)}/authz/resource-server`;

//Apis GET administración general de un reino
export const urlGetSettings = (realm: string, clientUuid: string) => `${urlAccessBase(realm, clientUuid)}/settings`;
export const urlGetScopes = (realm: string, clientUuid: string) => `${urlAccessBase(realm, clientUuid)}/scope`;
export const urlGetResources = (realm: string, clientUuid: string) => `${urlAccessBase(realm, clientUuid)}/resource`;
export const urlGetPolicies = (realm: string, clientUuid: string) => `${urlAccessBase(realm, clientUuid)}/policy`;
export const urlGetPermissions = (realm: string, clientUuid: string) => `${urlAccessBase(realm, clientUuid)}/permission`;
export const urlGetClientRoles = (realm: string, clientUuid: string) => `${urlClientBase(realm, clientUuid)}/roles`;

export const TIMEOUT_API_RECETA = 2000;
export const DEFAULT_CLIENTS_KC = ['account', 'account-console', 'admin-cli', 'broker', 'realm-management', 'security-admin-console'];
export const DEFAULT_ROL_KC = ['offline_access', 'default-roles-test', 'uma_authorization'];
