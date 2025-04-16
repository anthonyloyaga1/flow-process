import { Provider } from '../entities/provider.model';

export interface ProviderRepository {
  create(provider: Provider): Promise<void>;
  findById(id: string): Promise<Provider | undefined>;
  update(provider: Provider): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Provider[]>;
}

export const PROVIDER_REPOSITORY = Symbol('PROVIDER_REPOSITORY');
