import { ApiResponse } from '@nestjs/swagger';

import { ErrorResponse, FailResponse } from '../doc/base-responses';

const defaultResponses = [
  { status: 200, description: 'Success', type: null },
  { status: 400, description: 'Bad Request: Validación de forma en los datos de entrada (body, params, query) de la solicitud', type: FailResponse },
  { status: 422, description: 'Unprocessable entity: Mensajes controlados en reglas de negocio y procesos del sistema', type: FailResponse },
  { status: 500, description: 'Internal Server Error: Problemas como desconexiones de BDD, problemas de infraestructura, etc.', type: ErrorResponse },
];

export const SwaggerResponses = (successResponseType, extraResponses?: { status: number; description: string; type?: any }[]): MethodDecorator => {
  return (target: any, key: string | symbol, descriptor: PropertyDescriptor) => {
    defaultResponses[0].type = successResponseType;
    const mergedResponses = extraResponses ? [...defaultResponses, ...extraResponses] : defaultResponses;
    mergedResponses.forEach((response) => {
      ApiResponse({ status: response.status, description: response.description, type: response.type })(target, key, descriptor);
    });
  };
};
