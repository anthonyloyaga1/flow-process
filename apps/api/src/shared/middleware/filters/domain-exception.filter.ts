import { DomainException, ValidationException } from '@errors/domain-errors';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { PinoLogger } from 'nestjs-pino';

import { DomainExceptionMapper } from './domain-exception.mapper';
import { ErrorResponse } from './error-response';

@Catch(DomainException, ValidationException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<FastifyRequest>();
    const response = context.getResponse<FastifyReply>();
    const level = PinoLogger.root.level; // Cast to expected type

    //Mapped DomainException to HttpException for response handling
    const exceptionMapped = DomainExceptionMapper.toHttpException(exception);

    const handler = ErrorResponse.create({ request, response, exception: exceptionMapped, level });
    const customResponse = handler.buildJSendResponse();
    const customStatus = handler.getHttpStatus();
    handler.loggingResponse();

    response.status(customStatus).send(customResponse);
  }
}
