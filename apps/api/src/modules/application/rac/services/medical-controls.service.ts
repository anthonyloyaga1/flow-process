import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { Metadata } from '../../../../shared/base-class/payload-base';
import { getUserInitials } from '../../../../shared/helpers/user-initials';
import { MedicalControl } from '../../../domain/rac/models/medical-control';
import { MedicalControlsDomService } from '../../../domain/rac/services/medical-controls.dom.service';
import { CreateMedicalControlDto } from '../dto/create-medical-control.dto';
import { MedicalControlBasicDto, MedicalControlDto } from '../dto/medical-control.dto';
import { UpdateMedicalControlDto } from '../dto/update-medical-control.dto';

@Injectable()
export class MedicalControlsService {
  constructor(private readonly medicalControlsDomService: MedicalControlsDomService) {}

  /**
   * Crear revisión documental
   * @description CU_003_FLUJO_NORMAL Revisión documental
   *
   * @async
   * @param {CreateMedicalControlDto} body
   * @param {Metadata} metadata
   * @returns {Promise<MedicalControlBasicDto>}
   */
  async create(body: CreateMedicalControlDto, metadata: Metadata): Promise<MedicalControlBasicDto> {
    const medicalControl = plainToInstance(MedicalControl, body);

    //* Ref CU02_RN01 Iniciales del usuario que crea el proceso
    medicalControl.createdBy = metadata.user.preferred_username;
    medicalControl.createdByInitials = getUserInitials(metadata.user.name);
    medicalControl.createdByName = metadata.user.name;

    const medicalControlSaved = this.medicalControlsDomService.create(medicalControl);
    return plainToInstance(MedicalControlBasicDto, medicalControlSaved, { excludeExtraneousValues: true });
  }

  /**
   * Obtener revisión documental por id
   * @description CU_003_FLUJO_NORMAL Revisión documental
   *
   * @async
   * @param {number} id
   * @returns {Promise<MedicalControlDto>}
   */
  async findOneById(id: number): Promise<MedicalControlDto> {
    const medicalControl = await this.medicalControlsDomService.findOneById(id);
    return plainToInstance(MedicalControlDto, medicalControl, { excludeExtraneousValues: true });
  }

  async findOneByProcessId(processId: number): Promise<MedicalControlDto> {
    const medicalControl = await this.medicalControlsDomService.findOneByProcessId(processId);
    return plainToInstance(MedicalControlDto, medicalControl, { excludeExtraneousValues: true });
  }

  /**
   * Actualizar revisión documental
   * @description CU_003_FLUJO_NORMAL Revisión documental
   *
   * @async
   * @param {number} id
   * @param {UpdateMedicalControlDto} body
   * @param {Metadata} metadata
   * @returns {Promise<MedicalControlBasicDto>}
   */
  async update(id: number, body: UpdateMedicalControlDto, metadata: Metadata): Promise<MedicalControlBasicDto> {
    const medicalControl = plainToInstance(MedicalControl, { ...body, id });
    medicalControl.modifiedBy = metadata.user.preferred_username;

    const medicalControlEdited = this.medicalControlsDomService.update(medicalControl);

    return plainToInstance(MedicalControlBasicDto, medicalControlEdited, { excludeExtraneousValues: true });
  }
}
