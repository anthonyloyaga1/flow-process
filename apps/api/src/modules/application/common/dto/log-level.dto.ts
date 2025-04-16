import { IsEnum } from 'class-validator';

enum LogLevel {
  Fatal = 'fatal',
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
  Trace = 'trace',
  Silent = 'silent',
}

export class SetLogLevelDto {
  @IsEnum(LogLevel, { message: 'Invalid log level' })
  level: LogLevel;
}
