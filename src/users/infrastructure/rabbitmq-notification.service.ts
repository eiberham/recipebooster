import { Injectable } from '@nestjs/common'
import { User } from '../domain/user.interface'
import { NotificationService } from '../domain/notification.interface'
import { RabbitMQProducer } from '@/rabbitmq/rabbitmq.producer'

@Injectable()
export class RabbitMQNotificationService implements NotificationService {
    constructor(private readonly rabbitMQProducer: RabbitMQProducer){}
    async send(user: User, subject: string, body: string): Promise<void> {
        await this.rabbitMQProducer.sendToQueue('email_queue', {
            id: user.id,
            email: user.email,
            name: user.name,
            subject: subject,
            body
        })
    }
}