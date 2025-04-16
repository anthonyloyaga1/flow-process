import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

import { StateEnum } from '../../constants/state.enum';
import { JSend } from '../../interfaces/jsend.interface';

export class ErrorResponse {
  private readonly request: FastifyRequest;
  private readonly response: FastifyReply;
  private readonly exception: HttpException;
  private readonly httpStatus: number;
  private readonly cause: Error;
  private readonly message: string | any[];

  private readonly level: string;

  constructor(obj: { request: FastifyRequest; response: FastifyReply; exception: HttpException; level?: string }) {
    this.request = obj.request;
    this.response = obj.response;
    this.exception = obj.exception;
    this.httpStatus = obj.exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
    this.message = this.exception.getResponse()['message'] || this.exception.getResponse();
    this.cause = this.getCauseInfo(this.exception);
    this.level = obj.level ?? 'info';
  }

  static create(obj: { request: FastifyRequest; response: FastifyReply; exception: HttpException; level?: string }) {
    return new ErrorResponse(obj);
  }

  buildJSendResponse(): JSend {
    //Validación si se debe enviar la causa del error en la respuesta
    const causeReponse = this.isDebugLevel() ? this.cause : undefined;

    if (this.message) {
      //Validación cuando saltan excepciones con message tipo array (por lo general de class-validator)
      if (Array.isArray(this.message)) {
        return { status: StateEnum.FAIL, message: 'Datos de entrada inválidos', code: this.httpStatus, data: this.message };
      }
      if (typeof this.message === 'object') {
        return { status: StateEnum.ERROR, message: this.exception.name, code: this.httpStatus, data: this.message };
      }
      if (this.httpStatus >= 400 && this.httpStatus < 500) {
        return { status: StateEnum.FAIL, message: this.message, code: this.httpStatus, data: causeReponse };
      }
      if (this.httpStatus >= 500 && this.httpStatus < 600) {
        return { status: StateEnum.ERROR, message: this.message, code: this.httpStatus, data: causeReponse };
      }
      if (this.httpStatus >= 1000) {
        return { status: StateEnum.FAIL, message: this.message, code: this.httpStatus, data: causeReponse };
      }
    }

    return { status: StateEnum.ERROR, code: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error desconocido' };
  }

  //Obtiene el código de estado HTTP de la respuesta
  getHttpStatus() {
    return this.httpStatus || HttpStatus.INTERNAL_SERVER_ERROR;
  }

  loggingResponse() {
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
      status: this.httpStatus,
      message: this.message,
      requestTime: Date.now() - (this.request.raw['time'] || (0 as number)),
    };

    //Custom log level en función del código de estado de la respuesta (Warn y Error level)
    if ((this.httpStatus >= 400 && this.httpStatus < 500) || this.httpStatus > 1000) Logger.warn(dataLog);
    if (this.httpStatus >= 500 && this.httpStatus < 600) Logger.error({ ...dataLog, cause: this.exception.stack });

    //Log de la causa del error (Debug level)
    if (this.cause) {
      Logger.debug({
        request: { id: this.request.raw.id },
        cause: { name: this.cause?.name, message: this.cause?.message, stack: this.cause?.stack },
      });
    }

    //Log de la excepción completa (Trace level)
    Logger.verbose({ request: { id: this.request.raw.id }, exception: this.exception, cause: this.cause });
  }

  //Obtiene la información de la causa del error
  private getCauseInfo(exception: HttpException) {
    const cause = exception?.cause as Error;
    if (!cause) return undefined;

    return { name: cause?.name, message: cause?.message, stack: cause?.stack, ...cause };
  }

  //Obtiene el nombre de usuario autenticado en la petición. Esto es complicado de implementar en la configuración de pino options
  private getUserNameFromRequest() {
    if (this.request['user']) {
      return {
        preferred_username: this.request['user']?.preferred_username || 'Usuario no autenticado',
        resource_access: this.request['user']?.resource_access || 'Usuario no autenticado',
      };
    }
    return 'Usuario no autenticado';
  }

  //Valida si el nivel de log es debug o trace. Se usa para poder enviar en la respuesta de la petición el error completo (trace)
  private isDebugLevel(): boolean {
    const logLevel = {
      trace: 10, // TRACE
      debug: 20, // DEBUG
      info: 30, // INFO
      warn: 40, // WARN
      error: 50, // ERROR
    };
    const levelNumber = logLevel[this.level];
    return levelNumber <= 20;
  }
}
