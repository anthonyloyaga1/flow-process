export interface Identifier {
  use: string;
  type: string;
  value: string;
  period_start?: string;
  period_end?: string;
  assigner: string;
}

export interface OrganizationType {
  coding: string;
  text: string;
}

export interface Telecom {
  system: string;
  value: string;
  use: string;
}

export interface Address {
  use: string;
  type: string;
  text: string;
  district: string;
  state: string;
  postalcode: string;
  country: string;
}

export interface Contact {
  telecom: Telecom[];
  address: Address[];
}

export interface Position {
  longitude?: string;
  latitude?: string;
  altitude?: number;
}

export interface OrganizationLocation {
  type: string;
  description: string;
  position: Position;
}
