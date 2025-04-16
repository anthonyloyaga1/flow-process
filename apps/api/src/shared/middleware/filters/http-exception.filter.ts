import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { PinoLogger } from 'nestjs-pino';

import { ErrorResponse } from './error-response';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<FastifyRequest>();
    const response = context.getResponse<FastifyReply>();
    const level = PinoLogger.root.level;

    const handler = ErrorResponse.create({ request, response, exception, level });
    const customResponse = handler.buildJSendResponse();
    const customStatus = handler.getHttpStatus();
    handler.loggingResponse();

    response.status(customStatus).send(customResponse);
  }
}
