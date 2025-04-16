import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { Metadata } from '../../../../shared/base-class/payload-base';
import { getUserInitials } from '../../../../shared/helpers/user-initials';
import { BudgetShipment } from '../../../domain/rac/models/budget-shipment';
import { BudgetShipmentsDomService } from '../../../domain/rac/services/budget-shipments.dom.service';
import { BudgetShipmentBasicDto } from '../dto/budget-shipment.dto';
import { CreateBudgetShipmentDto } from '../dto/create-budget-shipment.dto';

@Injectable()
export class BudgetShipmentsService {
  constructor(private readonly budgetShipmentsDomService: BudgetShipmentsDomService) {}

  /**
   * Crear revisión documental
   * @description CU_003_FLUJO_NORMAL Revisión documental
   *
   * @async
   * @param {CreateBudgetShipmentDto} body
   * @param {Metadata} metadata
   * @returns {Promise<BudgetShipmentBasicDto>}
   */
  async create(body: CreateBudgetShipmentDto, metadata: Metadata): Promise<BudgetShipmentBasicDto> {
    const budgetShipment = plainToInstance(BudgetShipment, body);

    //* Ref CU02_RN01 Iniciales del usuario que crea el proceso
    budgetShipment.createdBy = metadata.user.preferred_username;
    budgetShipment.createdByInitials = getUserInitials(metadata.user.name);
    budgetShipment.createdByName = metadata.user.name;

    const budgetShipmentSaved = this.budgetShipmentsDomService.create(budgetShipment);
    return plainToInstance(BudgetShipmentBasicDto, budgetShipmentSaved, { excludeExtraneousValues: true });
  }
}
