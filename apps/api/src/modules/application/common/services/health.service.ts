import { Injectable } from '@nestjs/common';
import { DiskHealthIndicator, HealthCheckService, MemoryHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';
import * as os from 'os';

@Injectable()
export class HealthService {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
    private readonly diskHealthIndicator: DiskHealthIndicator,
    private readonly typeOrmHealthIndicator: TypeOrmHealthIndicator,
  ) {}

  checkHealth() {
    const pathDiskHealth = os.platform() === 'win32' ? 'C:/' : '/';
    const memory = parseInt(process.env.MEMORY_HEALTH_INDICATOR);
    const percentDisc = parseFloat(process.env.DISC_HEALTH_PERCENT);

    return this.healthCheckService.check([
      // the process should not use more than 300MB memory
      () => this.memoryHealthIndicator.checkHeap(`memory heap (< ${memory} MB)`, memory * 1024 * 1024),
      // The process should not have more than 300MB RSS memory allocated
      () => this.memoryHealthIndicator.checkRSS(`memory RSS (< ${memory} MB)`, memory * 1024 * 1024),
      // the used disk storage should not exceed the 50% of the available space
      () => this.diskHealthIndicator.checkStorage(`disk health (< ${percentDisc}%)`, { thresholdPercent: percentDisc, path: pathDiskHealth }),
      // Ping check database
      () => this.typeOrmHealthIndicator.pingCheck('database'),
      // Verificación del estado del microservicio SSO
    ]);
  }
}
