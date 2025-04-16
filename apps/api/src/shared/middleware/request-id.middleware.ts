import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(request: FastifyRequest['raw'], response: FastifyReply['raw'], next: () => void) {
    const requestId = uuidv4(); // Genera un nuevo UUID para el requestId
    request.id = requestId;
    request['time'] = Date.now();
    response.setHeader('X-Request-ID', requestId);
    next();
  }
}
