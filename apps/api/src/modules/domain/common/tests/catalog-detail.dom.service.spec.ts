import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { CatalogDetailEntity } from 'src/modules/infraestructure/database/entities/catalog-detail.entity';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { CatalogDetailRepository } from '../../../infraestructure/database/repositories/catalog-detail.repository';
import { CatalogDetailDomService } from '../services/catalog-detail.dom.service';

describe('CatalogDetailDomService', () => {
  let service: CatalogDetailDomService;
  let catalogDetailRepository: CatalogDetailRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogDetailDomService,
        {
          provide: CatalogDetailRepository,
          useValue: {
            findCollection: jest.fn(),
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CatalogDetailDomService>(CatalogDetailDomService);
    catalogDetailRepository = module.get<CatalogDetailRepository>(CatalogDetailRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findCollection', () => {
    it('should return a paginated collection of catalog details', async () => {
      const query: PaginateQuery = { page: 1, limit: 10 } as PaginateQuery;
      const catalogDetails: Paginated<CatalogDetailEntity> = {
        data: [{ id: 1, name: 'Detail 1' } as CatalogDetailEntity, { id: 2, name: 'Detail 2' } as CatalogDetailEntity],
        meta: {
          totalItems: 2,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
          sortBy: [],
          searchBy: [],
          search: '',
          select: [],
        },
        links: {
          first: '',
          previous: '',
          next: '',
          last: '',
          current: '',
        },
      };

      jest.spyOn(catalogDetailRepository, 'findCollection').mockResolvedValue(catalogDetails);

      const result = await service.findCollection(query);

      expect(result).toBe(catalogDetails);
      expect(catalogDetailRepository.findCollection).toHaveBeenCalledWith(query);
    });
  });

  describe('findOneById', () => {
    it('should return a catalog detail by id', async () => {
      const catalogDetail: CatalogDetailEntity = {
        id: 1,
        name: 'Detail 1',
        numericValue: 123,
        characterValue: 'A',
        catalogHeaderId: 1,
        catalogHeader: null,
        createdAt: new Date(),
        createdBy: '',
        modifiedBy: '',
        modifiedAt: undefined,
        active: true,
      };

      jest.spyOn(catalogDetailRepository, 'findOneById').mockResolvedValue(catalogDetail);

      const result = await service.findOneById(1);

      expect(result).toBe(catalogDetail);
      expect(catalogDetailRepository.findOneById).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if the catalog detail is not found', async () => {
      jest.spyOn(catalogDetailRepository, 'findOneById').mockResolvedValue(null);

      await expect(service.findOneById(1)).rejects.toThrow(
        new HttpException(ErrorMessage.CATALOG_NOT_FOUND.MSG, ErrorMessage.CATALOG_NOT_FOUND.CODE),
      );
    });
  });
});
