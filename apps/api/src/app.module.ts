import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard, KeycloakConnectModule, ResourceGuard, RoleGuard } from 'nest-keycloak-connect';
import { LoggerModule } from 'nestjs-pino';

import { AppService } from './app.service';
import { dataSourceConfig } from './config/datasource.config';
import { keycloakConnectOptions } from './config/keycloak.config';
import { pinoOptions } from './config/pino.config';
import { ProcessModule } from './contexts/rac/process/process.module';
import { ProviderModule } from './contexts/rac/provider/provider.module';
import { CommonModule } from './modules/application/common/common.module';
import { RacModule } from './modules/application/rac/rac.module';
import { ReportsModule } from './modules/application/reports/reports.module';
import { DomainExceptionFilter } from './shared/middleware/filters/domain-exception.filter';
import { HttpExceptionFilter } from './shared/middleware/filters/http-exception.filter';
import { RemoveNullsInterceptor } from './shared/middleware/interceptors/remove-nulls.interceptor';
import { SuccessResponseInterceptor } from './shared/middleware/interceptors/success-response.interceptor';
import { RequestIdMiddleware } from './shared/middleware/request-id.middleware';
import { ProcessStageHistoryModule } from './contexts/rac/process-stage-history/process-stage-history.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...dataSourceConfig, autoLoadEntities: true }),
    LoggerModule.forRoot(pinoOptions),
    KeycloakConnectModule.register(keycloakConnectOptions),
    CacheModule.register({ isGlobal: true }),
    ThrottlerModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    AutomapperModule.forRoot({ strategyInitializer: classes() }),
    RacModule,
    CommonModule,
    ReportsModule,
    ProcessModule,
    ProviderModule,
    ProcessStageHistoryModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RemoveNullsInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
