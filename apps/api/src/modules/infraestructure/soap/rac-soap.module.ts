import { Module } from '@nestjs/common';
import { SoapModule } from 'nestjs-soap';

import { soapOptions } from '../../../config/soap.config';
import { RegistroCivilSoapService } from './registro-civil/providers/registro-civil-soap.service';
import { PersonaSoapRepository } from './registro-civil/repositories/persona.soap.repository';

@Module({
  imports: [SoapModule.forRoot(soapOptions)],
  providers: [RegistroCivilSoapService, PersonaSoapRepository],
  exports: [PersonaSoapRepository],
})
export class RacSoapModule {}
