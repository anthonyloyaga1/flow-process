import { ApiProperty } from '@nestjs/swagger';

import { SuccessDoc } from '../../../../shared/base-class/doc-base';
import { PaymentShipmentBasicDto, PaymentShipmentDto } from '../dto/payment-shipment.dto';

export class PaymentShipmentBasicDoc extends SuccessDoc {
  @ApiProperty({ type: PaymentShipmentBasicDto, description: 'Datos de trámite' })
  data: PaymentShipmentBasicDto;
}

export class PaymentShipmentDoc extends SuccessDoc {
  @ApiProperty({ type: PaymentShipmentDto, description: 'Datos de trámite' })
  data: PaymentShipmentDto;
}

export class PaymentShipmentListDoc extends SuccessDoc {
  @ApiProperty({ type: [PaymentShipmentDto], description: 'Datos de trámite' })
  data: PaymentShipmentDto[];
}
