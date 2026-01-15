import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { RabbitmqModule } from './rabbitmq.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(RabbitmqModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
      queue: 'rabbitmq',
      queueOptions: {
        durable: false,
        arguments: { 
          'x-max-priority': 10,
          'x-dead-letter-exchange': 'dead_letter_exchange',
          'x-dead-letter-routing-key': 'dead_letter'
        }
      },
      noAck: false,
    },
  })
  
  await app.listen()
}
bootstrap()
