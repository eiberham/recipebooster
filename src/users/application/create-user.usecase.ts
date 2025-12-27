import bcrypt from 'bcrypt';
import { Injectable, Inject } from '@nestjs/common';
import type { UserRepository } from '../domain/user.interface';
import type { UserResponseDto } from '../controllers/dto/user-response.dto';
import { CreateUserDto } from '../controllers/dto/create-user.dto';
import { RabbitMQProducer } from '../../rabbitmq/rabbitmq.producer';

@Injectable()
export class CreateUserUsecase{
    constructor(
        @Inject('USER_REPOSITORY') 
        private readonly userRepository: UserRepository,
        private readonly rabbitMQProducer: RabbitMQProducer
    ) {}

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        return password;
    }

    async createUser( data : CreateUserDto ): Promise<UserResponseDto> {
        let user: UserResponseDto | null = null;
        try {
            const hashed = await this.hashPassword(data.password);

            const payload = {
                ...data,
                password: hashed
            }

            user = await this.userRepository.create(payload);

            await this.rabbitMQProducer.sendToQueue('email_queue', {
                id: user.id,
                email: user.email,
                name: user.name,
                subject: 'Welcome to superchef!',
                body: `
                    Thank you for registering at superchef. 
                    We are excited to have you on board! `
            });

            return user;
        } catch (error) {
            throw error;
        }
    }
}