import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { StateEnum } from '../constants/state.enum';
import { JSend } from '../interfaces/jsend.interface';

export class SuccessResponse implements JSend {
  @ApiProperty({ example: 'success', description: 'Indica el estado de la respuesta.', enum: StateEnum })
  status: StateEnum;

  @ApiProperty({ description: 'Campo con los datos del resultado de la solicitud.' })
  data: any;
}

export class ErrorResponse implements JSend {
  @ApiProperty({ example: 'error', description: 'Indica el estado de la respuesta.', enum: StateEnum })
  status: StateEnum;

  @ApiPropertyOptional({ description: 'Campo para la información adicional sobre la fuente del error interno del sistema.' })
  data?: any;

  @ApiPropertyOptional({ description: 'Campo para el mensaje significativo sobre el error.' })
  message?: string;

  @ApiPropertyOptional({ description: 'Campo para el código de error generado.' })
  code?: number;
}

export class FailResponse implements JSend {
  @ApiProperty({ example: 'fail', description: 'Indica el estado de la respuesta.', enum: StateEnum })
  status: StateEnum;

  @ApiPropertyOptional({ description: 'Campo para los detalles del fallo controlado.' })
  data?: any;

  @ApiPropertyOptional({ description: 'Campo para el mensaje significativo sobre el fallo.' })
  message?: string;

  @ApiPropertyOptional({ description: 'Campo para el código del fallo.' })
  code?: number;
}
