import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';
import { Throttle } from '@nestjs/throttler';
import { Public } from 'nest-keycloak-connect';
import { PinoLogger } from 'nestjs-pino';

import { SetLogLevelDto } from '../dto/log-level.dto';
import { HealthService } from '../services/health.service';

@Controller('config')
@ApiExcludeController() // Esta ruta estará oculta en Swagger
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('health')
  @HealthCheck()
  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  check() {
    return this.healthService.checkHealth();
  }

  @Post('change-loggin-level')
  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  setLevel(@Query() query: SetLogLevelDto) {
    const { level } = query;
    PinoLogger.root.level = level;
    return 'Level changed';
  }
}
