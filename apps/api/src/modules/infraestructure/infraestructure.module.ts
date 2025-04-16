import { Module } from '@nestjs/common';

import { RacApiModule } from './api/rac-api.module';
import { RacDbModule } from './database/rac-db.module';
import { RacSoapModule } from './soap/rac-soap.module';

@Module({
  imports: [RacApiModule, RacDbModule, RacSoapModule],
  exports: [RacApiModule, RacDbModule, RacSoapModule],
})
export class InfraestructureModule {}
