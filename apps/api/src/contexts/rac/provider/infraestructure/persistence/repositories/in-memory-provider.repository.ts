import { Provider } from '../../../domain/entities/provider.model';
import { ProviderRepository } from '../../../domain/repositories/provider.repository';

export class InMemoryProviderRepository implements ProviderRepository {
  private readonly providers = new Map<string, Provider>(
    Array.from({ length: 10 }, (_, i) => [
      i.toString(),
      Provider.fromPrimitives({
        id: i.toString(),
        name: `Provider ${i}`,
        unicode: `CODE-${i}`,
        taxId: `123456789012${i}`,
        province: `Province ${i}`,
      }),
    ]),
  );

  async create(provider: Provider): Promise<void> {
    this.providers.set(provider.id.getValue(), provider);
    return Promise.resolve();
  }

  async findById(id: string): Promise<Provider> {
    return Promise.resolve(this.providers.get(id));
  }

  async update(provider: Provider): Promise<void> {
    if (!this.providers.has(provider.id.getValue())) {
      throw new Error('Proveedor no encontrado.');
    }
    this.providers.set(provider.id.getValue(), provider);
  }

  async delete(id: string): Promise<void> {
    this.providers.delete(id);
  }

  async findAll(): Promise<Provider[]> {
    return Promise.resolve(Array.from(this.providers.values()));
  }
}
