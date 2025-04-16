import { Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { parseOrNull } from './handler-parse-json';

ConfigModule.forRoot({ envFilePath: '.env' });

export const envValue = (key: string, isJson = false) => {
  const value = process.env[key];
  if (value == null || value == '') Logger.error('No se encontro la variable de ambiente .env: ' + key);
  if (isJson) {
    const valueParsed = parseOrNull(value);
    if (!valueParsed) Logger.error('No se pudo convertir la variable de ambient .env: ' + key);
    return valueParsed;
  }
  return value;
};
