import { PartialType } from '@nestjs/swagger';

import { CreateTariffControlDto } from '../../rac/dto/create-tariff-control.dto';

export class UpdateTariffControlDto extends PartialType(CreateTariffControlDto) {}
