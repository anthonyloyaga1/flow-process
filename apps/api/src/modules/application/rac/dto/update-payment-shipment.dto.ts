import { PartialType } from '@nestjs/swagger';
import { CreatePaymentShipmentDto } from './create-payment-shipment.dto';

export class UpdatePaymentShipmentDto extends PartialType(CreatePaymentShipmentDto) {}
