import { ClientProxyFactory, RmqOptions, TcpClientOptions, Transport } from '@nestjs/microservices';

export const clientConfigSSO: TcpClientOptions = {
  transport: Transport.TCP,
  options: {
    host: '172.32.4.65',
    port: 3300,
  },
};

export const clientConfigRMQ: RmqOptions = {
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://admin:admin@localhost:5672'],
    queue: 'default',
  },
};

export const msReports = ClientProxyFactory.create(clientConfigSSO);
export const msReportsRMQ = ClientProxyFactory.create(clientConfigRMQ);
