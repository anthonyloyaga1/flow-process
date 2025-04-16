import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { Metadata } from '../../../../shared/base-class/payload-base';
import { getUserInitials } from '../../../../shared/helpers/user-initials';
import { TariffControl } from '../../../domain/rac/models/tariff-control';
import { TariffControlsDomService } from '../../../domain/rac/services/tariff-controls.dom.service';
import { CreateTariffControlDto } from '../dto/create-tariff-control.dto';
import { TariffControlBasicDto, TariffControlDto } from '../dto/tariff-control.dto';
import { UpdateTariffControlDto } from '../dto/update-tariff-control.dto';

@Injectable()
export class TariffControlsService {
  constructor(private readonly tariffControlsDomService: TariffControlsDomService) {}

  /**
   * Crear Control de Tarifa
   * @description CU_003_FLUJO_NORMAL Revisión documental
   *
   * @async
   * @param {CreateTariffControlDto} body
   * @param {Metadata} metadata
   * @returns {Promise<TariffControlBasicDto>}
   */
  async create(body: CreateTariffControlDto, metadata: Metadata): Promise<TariffControlBasicDto> {
    const tariffControl = plainToInstance(TariffControl, body);

    //* Ref CU02_RN01 Iniciales del usuario que crea el proceso
    tariffControl.createdBy = metadata.user.preferred_username;
    tariffControl.createdByInitials = getUserInitials(metadata.user.name);
    tariffControl.createdByName = metadata.user.name;

    const tariffControlSaved = this.tariffControlsDomService.create(tariffControl);
    return plainToInstance(TariffControlBasicDto, tariffControlSaved, { excludeExtraneousValues: true });
  }

  /**
   * Obtener revisión documental por id
   * @description CU_003_FLUJO_NORMAL Revisión documental
   *
   * @async
   * @param {number} id
   * @returns {Promise<TariffControlDto>}
   */
  async findOneById(id: number): Promise<TariffControlDto> {
    const tariffControl = await this.tariffControlsDomService.findOneById(id);
    return plainToInstance(TariffControlDto, tariffControl, { excludeExtraneousValues: true });
  }

  async findOneByProcessId(processId: number): Promise<TariffControlDto> {
    const tariffControl = await this.tariffControlsDomService.findOneByProcessId(processId);
    return plainToInstance(TariffControlDto, tariffControl, { excludeExtraneousValues: true });
  }

  /**
   * Actualizar revisión documental
   * @description CU_003_FLUJO_NORMAL Revisión documental
   *
   * @async
   * @param {number} id
   * @param {UpdateTariffControlDto} body
   * @param {Metadata} metadata
   * @returns {Promise<TariffControlBasicDto>}
   */
  async update(id: number, body: UpdateTariffControlDto, metadata: Metadata): Promise<TariffControlBasicDto> {
    const tariffControl = plainToInstance(TariffControl, { ...body, id });
    tariffControl.modifiedBy = metadata.user.preferred_username;

    const tariffControlEdited = this.tariffControlsDomService.update(tariffControl);

    return plainToInstance(TariffControlBasicDto, tariffControlEdited, { excludeExtraneousValues: true });
  }
}
