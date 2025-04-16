import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('process.created')
  getHello(@Payload() parload) {
    console.log('Payload', parload);
    console.log('Ejecutado proceso created');
  }
}
