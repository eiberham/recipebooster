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
                    const { name, email } = JSON.parse(content)
                    await this.emailService.send(name, email, 'Welcome to superchef!', 'Thank you for registering at superchef. We are excited to have you on board!')
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