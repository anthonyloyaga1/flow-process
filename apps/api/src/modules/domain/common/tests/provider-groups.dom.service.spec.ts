import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { ProviderGroupsRepository } from '../../../infraestructure/database/repositories/provider-groups.repository';
import { ProviderGroup } from '../models/provider-group';
import { ProviderGroupsDomService } from '../services/provider-groups.dom.service';

describe('ProviderGroupsDomService', () => {
  let service: ProviderGroupsDomService;
  let providerGroupsRepository: ProviderGroupsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProviderGroupsDomService,
        {
          provide: ProviderGroupsRepository,
          useValue: {
            findList: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProviderGroupsDomService>(ProviderGroupsDomService);
    providerGroupsRepository = module.get<ProviderGroupsRepository>(ProviderGroupsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findList', () => {
    it('should return a list of provider groups', async () => {
      const providerGroups = [{ id: 1, name: 'Group 1' } as ProviderGroup, { id: 2, name: 'Group 2' } as ProviderGroup];

      jest.spyOn(providerGroupsRepository, 'findList').mockResolvedValue(providerGroups);

      const result = await service.findList();

      expect(result).toBe(providerGroups);
      expect(providerGroupsRepository.findList).toHaveBeenCalled();
    });

    it('should throw an exception if no provider groups are found', async () => {
      jest.spyOn(providerGroupsRepository, 'findList').mockResolvedValue(null);

      await expect(service.findList()).rejects.toThrow(new HttpException(ErrorMessage.PROVIDER_NOT_FOUND.MSG, ErrorMessage.PROVIDER_NOT_FOUND.CODE));
    });
  });
});
