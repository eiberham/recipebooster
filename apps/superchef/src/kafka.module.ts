import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Global() // Makes the module available globally
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
            clientId: 'superchef-api',
          },
          consumer: {
            groupId: 'analytics-consumer',
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule], // Export the module so others can use it
})
export class KafkaModule {}