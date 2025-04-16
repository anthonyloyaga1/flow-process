import { HttpException, Injectable } from '@nestjs/common';
import { PaginateQuery } from 'nestjs-paginate';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { OrganizationsRepository } from '../../../infraestructure/database/repositories/organizations.reposistory';

@Injectable()
export class OrganizationsDomService {
  constructor(private readonly organizationRepository: OrganizationsRepository) {}

  async findOneByUnicodigo(unicode: string) {
    const id = parseInt(unicode);

    if (isNaN(id)) throw new HttpException(ErrorMessage.PROVIDER_INVALID_UNICODE.MSG, ErrorMessage.PROVIDER_INVALID_UNICODE.CODE);
    const entidad = await this.organizationRepository.findOneById(id);
    if (!entidad) throw new HttpException(ErrorMessage.ORGANIZATIONS_NOT_FOUND.MSG, ErrorMessage.ORGANIZATIONS_NOT_FOUND.CODE);

    return entidad;
  }

  findCollection(query: PaginateQuery) {
    return this.organizationRepository.findCollection(query);
  }

  async findListZones() {
    return await this.organizationRepository.findListZones();
  }
}
