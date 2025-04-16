import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { Metadata } from '../../../../shared/base-class/payload-base';
import { getUserInitials } from '../../../../shared/helpers/user-initials';
import { PaymentShipment } from '../../../domain/rac/models/payment-shipment';
import { PaymentShipmentsDomService } from '../../../domain/rac/services/payment-shipments.dom.service';
import { CreatePaymentShipmentDto } from '../dto/create-payment-shipment.dto';
import { PaymentShipmentBasicDto, PaymentShipmentDto } from '../dto/payment-shipment.dto';
import { UpdatePaymentShipmentDto } from '../dto/update-payment-shipment.dto';

@Injectable()
export class PaymentShipmentsService {
  constructor(private readonly paymentShipmentsDomService: PaymentShipmentsDomService) {}

  /**
   * Crear revisión documental
   * @description CU_003_FLUJO_NORMAL Revisión documental
   *
   * @async
   * @param {CreatePaymentShipmentDto} body
   * @param {Metadata} metadata
   * @returns {Promise<PaymentShipmentBasicDto>}
   */
  async create(body: CreatePaymentShipmentDto, metadata: Metadata): Promise<PaymentShipmentBasicDto> {
    const paymentShipment = plainToInstance(PaymentShipment, body);

    //* Ref CU02_RN01 Iniciales del usuario que crea el proceso
    paymentShipment.createdBy = metadata.user.preferred_username;
    paymentShipment.createdByInitials = getUserInitials(metadata.user.name);
    paymentShipment.createdByName = metadata.user.name;

    const paymentShipmentSaved = this.paymentShipmentsDomService.create(paymentShipment);
    return plainToInstance(PaymentShipmentBasicDto, paymentShipmentSaved, { excludeExtraneousValues: true });
  }

  /**
   * Obtener revisión documental por id
   * @description CU_003_FLUJO_NORMAL Revisión documental
   *
   * @async
   * @param {number} id
   * @returns {Promise<PaymentShipmentDto>}
   */
  async findOneById(id: number): Promise<PaymentShipmentDto> {
    const paymentShipment = await this.paymentShipmentsDomService.findOneById(id);
    return plainToInstance(PaymentShipmentDto, paymentShipment, { excludeExtraneousValues: true });
  }

  async findOneByProcessId(processId: number): Promise<PaymentShipmentDto> {
    const paymentShipment = await this.paymentShipmentsDomService.findOneByProcessId(processId);
    return plainToInstance(PaymentShipmentDto, paymentShipment, { excludeExtraneousValues: true });
  }

  /**
   * Actualizar revisión documental
   * @description CU_003_FLUJO_NORMAL Revisión documental
   *
   * @async
   * @param {number} id
   * @param {UpdatePaymentShipmentDto} body
   * @param {Metadata} metadata
   * @returns {Promise<PaymentShipmentBasicDto>}
   */
  async update(id: number, body: UpdatePaymentShipmentDto, metadata: Metadata): Promise<PaymentShipmentBasicDto> {
    const paymentShipment = plainToInstance(PaymentShipment, { ...body, id });
    paymentShipment.modifiedBy = metadata.user.preferred_username;

    const paymentShipmentEdited = this.paymentShipmentsDomService.update(paymentShipment);

    return plainToInstance(PaymentShipmentBasicDto, paymentShipmentEdited, { excludeExtraneousValues: true });
  }
}
