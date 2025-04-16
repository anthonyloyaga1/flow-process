import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

import { Constantes } from '../shared/constants/constantes';
import { ErrorResponse, FailResponse, SuccessResponse } from '../shared/doc/base-responses';

export const initSwagger = (app: INestApplication) => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle(Constantes.API_TITLE)
    .addBearerAuth()
    .setDescription(Constantes.API_DESC)
    .setVersion(Constantes.API_VERSION)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, { extraModels: [SuccessResponse, ErrorResponse, FailResponse] });
  writeFileSync('./swagger-spec.json', JSON.stringify(document));

  SwaggerModule.setup('/doc', app, document, { swaggerOptions: { filter: true } });
};
