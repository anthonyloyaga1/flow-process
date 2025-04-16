import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Paginated, PaginateQuery } from 'nestjs-paginate';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { ProvidersRepository } from '../../../infraestructure/database/repositories/providers.repository';
import { Provider } from '../models/provider';
import { ProvidersDomService } from '../services/providers.dom.service';

describe('ProvidersDomService', () => {
  let service: ProvidersDomService;
  let providersRepository: ProvidersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProvidersDomService,
        {
          provide: ProvidersRepository,
          useValue: {
            findOneByUnicode: jest.fn(),
            insert: jest.fn(),
            findOneById: jest.fn(),
            findCollection: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProvidersDomService>(ProvidersDomService);
    providersRepository = module.get<ProvidersRepository>(ProvidersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a provider', async () => {
      const data: Provider = { unicode: '123', name: 'Provider Name' } as Provider;

      jest.spyOn(providersRepository, 'findOneByUnicode').mockResolvedValue(null);
      jest.spyOn(providersRepository, 'insert').mockResolvedValue(data);

      const result = await service.create(data);

      expect(result).toBe(data);
      expect(providersRepository.findOneByUnicode).toHaveBeenCalledWith(data.unicode);
      expect(providersRepository.insert).toHaveBeenCalledWith(data);
    });

    it('should throw an exception if the provider already exists', async () => {
      const data: Provider = { unicode: '123', name: 'Provider Name' } as Provider;

      jest.spyOn(providersRepository, 'findOneByUnicode').mockResolvedValue(data);

      await expect(service.create(data)).rejects.toThrow(new HttpException(ErrorMessage.PROVIDER_EXIST.MSG, ErrorMessage.PROVIDER_EXIST.CODE));
    });
  });

  describe('findOneById', () => {
    it('should return a provider by id', async () => {
      const provider: Provider = { id: 1, unicode: '123', name: 'Provider Name' } as Provider;

      jest.spyOn(providersRepository, 'findOneById').mockResolvedValue(provider);

      const result = await service.findOneById(1);

      expect(result).toBe(provider);
      expect(providersRepository.findOneById).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if the provider is not found', async () => {
      jest.spyOn(providersRepository, 'findOneById').mockResolvedValue(null);

      await expect(service.findOneById(1)).rejects.toThrow(
        new HttpException(ErrorMessage.PROVIDER_NOT_FOUND.MSG, ErrorMessage.PROVIDER_NOT_FOUND.CODE),
      );
    });
  });

  describe('findOneByUnicodigo', () => {
    it('should return a provider by unicode', async () => {
      const provider: Provider = { id: 1, unicode: '123', name: 'Provider Name' } as Provider;

      jest.spyOn(providersRepository, 'findOneByUnicode').mockResolvedValue(provider);

      const result = await service.findOneByUnicodigo('123');

      expect(result).toBe(provider);
      expect(providersRepository.findOneByUnicode).toHaveBeenCalledWith('123');
    });

    it('should throw an exception if the unicode is invalid', async () => {
      await expect(service.findOneByUnicodigo('invalid')).rejects.toThrow(
        new HttpException(ErrorMessage.PROVIDER_INVALID_UNICODE.MSG, ErrorMessage.PROVIDER_INVALID_UNICODE.CODE),
      );
    });

    it('should throw an exception if the provider is not found', async () => {
      jest.spyOn(providersRepository, 'findOneByUnicode').mockResolvedValue(null);

      await expect(service.findOneByUnicodigo('123')).rejects.toThrow(
        new HttpException(ErrorMessage.PROVIDER_NOT_FOUND.MSG, ErrorMessage.PROVIDER_NOT_FOUND.CODE),
      );
    });
  });

  describe('findCollection', () => {
    it('should return a collection of providers', async () => {
      const query = {} as PaginateQuery;
      const paginatedProviders = { data: [{ id: 1, unicode: '123', name: 'Provider Name' }], meta: {} } as Paginated<Provider>;

      jest.spyOn(providersRepository, 'findCollection').mockResolvedValue(paginatedProviders);

      const result = await service.findCollection(query);

      expect(result).toBe(paginatedProviders);
      expect(providersRepository.findCollection).toHaveBeenCalledWith(query);
    });
  });
});
