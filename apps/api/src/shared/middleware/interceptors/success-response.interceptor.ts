import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { map, Observable } from 'rxjs';

import { SuccessResponse } from './success-response';

@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const response = context.switchToHttp().getResponse<FastifyReply>();

    const handler = new SuccessResponse({ request, response, context });

    return next.handle().pipe(map((data) => handler.handlerSuccessResponses(data)));
  }
}
