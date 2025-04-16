import { HttpException, Injectable } from '@nestjs/common';
import { PaginateQuery } from 'nestjs-paginate';
import { ProvinceEntity } from 'src/modules/infraestructure/database/entities/province.entity';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { ProvinciesRepository } from '../../../infraestructure/database/repositories/provinces.repository';

@Injectable()
export class ProvincesDomService {
  constructor(private readonly provincesRepository: ProvinciesRepository) {}

  findCollection(query: PaginateQuery) {
    return this.provincesRepository.findCollection(query);
  }

  async findOneByCode(code: string) {
    const id = parseInt(code);
    this.checkValidProvinceCode(id);

    const province = await this.provincesRepository.findOneById(id);
    this.checkProvinceExist(province);

    return province;
  }

  private checkProvinceExist(province: ProvinceEntity) {
    if (!province) throw new HttpException(ErrorMessage.PROVINCE_NOT_FOUND.MSG, ErrorMessage.PROVINCE_NOT_FOUND.CODE);
  }

  private checkValidProvinceCode(id: number) {
    if (isNaN(id)) throw new HttpException(ErrorMessage.PROVINCE_INVALID_CODE.MSG, ErrorMessage.PROVINCE_INVALID_CODE.CODE);
  }
}
