import { HttpStatus } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

import { envValue } from '../helpers/handler-env-value';

export function swaggerPathMiddleware(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
  const path = req.url;
  const swaggerPaths = envValue('SWAGGER_PATHS', true);
  const pathDoc = envValue('PATH_DOC_SWAGGER');
  if (path.startsWith(pathDoc)) {
    const isCorrectPath = swaggerPaths?.includes(path);
    if (!isCorrectPath) {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.write(JSON.stringify({ message: `Cannot GET ${req.url}`, error: 'Not Found', statusCode: HttpStatus.NOT_FOUND }));
      res.end();
      return;
    }
  }
  next();
}
