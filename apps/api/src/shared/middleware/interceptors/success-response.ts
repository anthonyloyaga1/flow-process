import { ExecutionContext, Logger } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

import { StateEnum } from '../../constants/state.enum';
import { JSend } from '../../interfaces/jsend.interface';

export class SuccessResponse {
  request: FastifyRequest;
  response: FastifyReply;
  context: ExecutionContext;
  status: number;

  constructor(obj: { request: FastifyRequest; response: FastifyReply; context?: ExecutionContext }) {
    this.request = obj.request;
    this.response = obj.response;
    this.context = obj.context;
    this.status = this.response?.statusCode || 200;
  }

  handlerSuccessResponses(data: any): JSend {
    this.successLog();
    return { status: StateEnum.SUCCESS, data };
  }

  private successLog() {
    const dataLog = {
      request: {
        id: this.request.raw.id,
        method: this.request.method,
        userAuth: this.getUserNameFromRequest(),
        url: this.request.url,
        body: this.request.body,
        query: this.request.query,
        remoteAddress: this.request.socket.remoteAddress,
        remotePort: this.request.socket.remotePort,
      },
      status: this.status,
      message: 'request completed',
      context: this.context?.getClass()?.name || '',
      contextMethod: this.context?.getHandler()?.name || '',
      requestTime: Date.now() - this.request.raw['time'] || -1,
    };
    Logger.log(dataLog);
  }

  private getUserNameFromRequest() {
    if (this.request['user']) {
      return {
        preferred_username: this.request['user']?.preferred_username || 'Usuario no autenticado',
        resource_access: this.request['user']?.resource_access || 'Usuario no autenticado',
      };
    }
    return 'Usuario no autenticado';
  }
}
