import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { RabbitMQConsumer } from './rabbitmq.consumer';
import { RabbitMQProducer } from './rabbitmq.producer';
import { EmailService } from '../emails/email.service';

@Module({
    providers: [
        RabbitMQService,
        RabbitMQConsumer,
        RabbitMQProducer,
        EmailService
    ],
    exports: [RabbitMQProducer],
})
export class RabbitMQModule {}