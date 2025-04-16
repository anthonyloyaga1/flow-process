import { ConfigModule, ConfigService } from '@nestjs/config';
import { SoapModuleOptions } from 'nestjs-soap';

ConfigModule.forRoot({ envFilePath: '.env' });
const config = new ConfigService();

export const soapOptions: SoapModuleOptions = {
  clientName: 'RC_SOAP_CLIENT',
  uri: config.get('RC_WSDLSERVERURL'),
  auth: {
    type: 'basic',
    username: config.get('RC_USER'),
    password: config.get('RC_PASSWORD'),
  },
};
