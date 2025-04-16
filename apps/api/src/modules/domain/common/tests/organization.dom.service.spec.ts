import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Paginated, PaginateQuery } from 'nestjs-paginate';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { OrganizationEntity } from '../../../infraestructure/database/entities/organization.entity';
import { OrganizationsRepository } from '../../../infraestructure/database/repositories/organizations.reposistory';
import { OrganizationsDomService } from '../services/organization.dom.service';

describe('OrganizationsDomService', () => {
  let service: OrganizationsDomService;
  let organizationRepository: OrganizationsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsDomService,
        {
          provide: OrganizationsRepository,
          useValue: {
            findOneById: jest.fn(),
            findCollection: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrganizationsDomService>(OrganizationsDomService);
    organizationRepository = module.get<OrganizationsRepository>(OrganizationsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByUnicodigo', () => {
    it('should return an organization by unicode', async () => {
      const organization: OrganizationEntity = { id: 1, organizationName: 'Org1' } as OrganizationEntity;

      jest.spyOn(organizationRepository, 'findOneById').mockResolvedValue(organization);

      const result = await service.findOneByUnicodigo('1');

      expect(result).toBe(organization);
      expect(organizationRepository.findOneById).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if the unicode is invalid', async () => {
      await expect(service.findOneByUnicodigo('invalid')).rejects.toThrow(
        new HttpException(ErrorMessage.PROVIDER_INVALID_UNICODE.MSG, ErrorMessage.PROVIDER_INVALID_UNICODE.CODE),
      );
    });

    it('should throw an exception if the organization is not found', async () => {
      jest.spyOn(organizationRepository, 'findOneById').mockResolvedValue(null);

      await expect(service.findOneByUnicodigo('1')).rejects.toThrow(
        new HttpException(ErrorMessage.ORGANIZATIONS_NOT_FOUND.MSG, ErrorMessage.ORGANIZATIONS_NOT_FOUND.CODE),
      );
    });
  });

  describe('findCollection', () => {
    it('should return a paginated collection of organizations', async () => {
      const query: PaginateQuery = { page: 1, limit: 10 } as PaginateQuery;
      const organizations: Paginated<OrganizationEntity> = {
        data: [{ id: 1, organizationName: 'Org1' } as OrganizationEntity, { id: 2, organizationName: 'Org2' } as OrganizationEntity],
        meta: { totalItems: 2, itemsPerPage: 10, totalPages: 1, currentPage: 1 } as any,
        links: { first: '', previous: '', next: '', last: '', current: '' },
      };

      jest.spyOn(organizationRepository, 'findCollection').mockResolvedValue(organizations);

      const result = await service.findCollection(query);

      expect(result).toBe(organizations);
      expect(organizationRepository.findCollection).toHaveBeenCalledWith(query);
    });
  });
});
