import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('user_created')
  getHello(@Payload() parload): string {
    console.log('Payload', parload);
    console.log(this.appService.getHello());
    return this.appService.getHello();
  }
}
