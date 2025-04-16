export interface TokenInfo {
  exp?: number;
  iat?: number;
  auth_time?: number;
  jti?: string;
  iss?: string;
  aud?: string;
  sub?: string;
  typ?: string;
  azp?: string;
  nonce?: string;
  session_state?: string;
  acr?: string;
  resource_access?: ResourceAccess;
  scope?: string;
  sid?: string;
  email_verified?: boolean;
  preferred_username?: string;
  id?: number;
  name?: string;
  cedula?: string;
  entidad_json?: Entidad[];
  distrito_json?: Distrito[];
  given_name?: string;
  fuente_datos?: string;
  cadena_farmacia?: string;
  family_name?: string;
  email?: string;
}

interface Entidad {
  zona?: string;
  distrito?: string;
  idEntidad?: number;
  unicode?: string;
  nombreEntidad?: string;
  eod?: string;
  codNivelAtencion?: number;
  codTipoEntidad?: number;
  desTipoEntidad?: string;
}

export interface Distrito {
  zona?: string;
  distrito?: string;
  eod?: string;
}

interface ResourceAccess {
  [key: string]: {
    roles: string[];
  };
}
