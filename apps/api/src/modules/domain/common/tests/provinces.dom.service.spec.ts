import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Paginated, PaginateQuery } from 'nestjs-paginate';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { ProvinceEntity } from '../../../infraestructure/database/entities/province.entity';
import { ProvinciesRepository } from '../../../infraestructure/database/repositories/provinces.repository';
import { ProvincesDomService } from '../services/provinces.dom.service';

describe('ProvincesDomService', () => {
  let service: ProvincesDomService;
  let provincesRepository: ProvinciesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProvincesDomService,
        {
          provide: ProvinciesRepository,
          useValue: {
            findCollection: jest.fn(),
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProvincesDomService>(ProvincesDomService);
    provincesRepository = module.get<ProvinciesRepository>(ProvinciesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findCollection', () => {
    it('should return a paginated collection of provinces', async () => {
      const query: PaginateQuery = { page: 1, limit: 10 } as PaginateQuery;
      const provinces: Paginated<ProvinceEntity> = {
        data: [{ id: 1, name: 'Province 1' } as ProvinceEntity, { id: 2, name: 'Province 2' } as ProvinceEntity],
      } as Paginated<ProvinceEntity>;

      jest.spyOn(provincesRepository, 'findCollection').mockResolvedValue(provinces);

      const result = await service.findCollection(query);

      expect(result).toBe(provinces);
      expect(provincesRepository.findCollection).toHaveBeenCalledWith(query);
    });
  });

  describe('findOneByCode', () => {
    it('should return a province by code', async () => {
      const province: ProvinceEntity = {
        id: 1,
        name: 'Province 1',
      } as ProvinceEntity;

      jest.spyOn(provincesRepository, 'findOneById').mockResolvedValue(province);

      const result = await service.findOneByCode('1');

      expect(result).toBe(province);
      expect(provincesRepository.findOneById).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if the code is invalid', async () => {
      await expect(service.findOneByCode('invalid')).rejects.toThrow(
        new HttpException(ErrorMessage.PROVINCE_INVALID_CODE.MSG, ErrorMessage.PROVINCE_INVALID_CODE.CODE),
      );
    });

    it('should throw an exception if the province is not found', async () => {
      jest.spyOn(provincesRepository, 'findOneById').mockResolvedValue(null);

      await expect(service.findOneByCode('1')).rejects.toThrow(
        new HttpException(ErrorMessage.PROVINCE_NOT_FOUND.MSG, ErrorMessage.PROVINCE_NOT_FOUND.CODE),
      );
    });
  });
});
