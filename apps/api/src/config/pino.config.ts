import { ConfigModule } from '@nestjs/config';
import * as dayjs from 'dayjs';
import { Params } from 'nestjs-pino';

ConfigModule.forRoot({ envFilePath: '.env' });

const transformOptions = {
  target: 'pino-pretty',
  options: {
    colorizeObjects: true,
    singleLine: true,
  },
};

export const pinoOptions: Params = {
  pinoHttp: {
    // pretty = true (colorizado de logs), json = false (sin colorizado de logs)
    transport: process.env.LOG_STYLE === 'pretty' ? transformOptions : undefined,

    //trace = 10 (trazabilidad), debug = 20(debugging), info = 30 (info) [prod], warning = 40 (warning), error = 50 (error)
    level: process.env.LOG_LEVEL ?? 'info',

    messageKey: 'message',
    autoLogging: false,
    timestamp: () => `,"time":"${dayjs().format()}"`,
    serializers: {
      req: () => undefined,
      res: () => undefined,
    },
  },
};
