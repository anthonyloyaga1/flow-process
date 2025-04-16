import { ValidationPipe } from '@nestjs/common';

export const validationCustomConfig = new ValidationPipe({
  transform: false,
  whitelist: true,
  forbidNonWhitelisted: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
});
