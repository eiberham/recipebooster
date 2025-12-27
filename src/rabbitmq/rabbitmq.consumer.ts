import { Injectable, OnModuleInit } from '@nestjs/common'
import { RabbitMQService } from './rabbitmq.service';
import { EmailService } from '../emails/email.service';

@Injectable()
export class RabbitMQConsumer implements OnModuleInit {
    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly emailService: EmailService
    ){}
    async onModuleInit() {
        const channel = await this.rabbitMQService.getChannel()
        channel.assertQueue('email_queue', { durable: true })

        channel.consume('email_queue', async (msg) => {
            if (msg !== null) {
                try {
                    const content = msg.content.toString()
                    const { name, email, subject, body } = JSON.parse(content)
                    await this.emailService.send(name, email, subject, body)
                    channel.ack(msg)
                } catch (error) {
                    setTimeout(() => {
                        channel.nack(msg)
                    }, 5e3)
                }
            }
        })
    }
}