import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

ConfigModule.forRoot({ envFilePath: '.env' });
const configService = new ConfigService();

export const dataSourceConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASS'),
  database: configService.get('DB_NAME'),
  entities: [__dirname + '../../**/*entity{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['error', 'log', 'warn'],
  namingStrategy: new SnakeNamingStrategy(),
  logger: 'advanced-console',
};
