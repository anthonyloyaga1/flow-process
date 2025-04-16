import { ConfigModuleOptions } from '@nestjs/config';

export const configCustomOptions: ConfigModuleOptions = { isGlobal: true, envFilePath: '.env' };
