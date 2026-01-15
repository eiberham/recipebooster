import bcrypt from 'bcrypt';
import { Injectable, Inject } from '@nestjs/common';
import type { UserRepository } from '../domain/user.interface';
import { UserResponseData } from '../domain/user.interface';
import { CreateUserData } from '../domain/user.interface';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CreateUserUsecase{
    constructor(
        @Inject('USER_REPOSITORY') 
        private readonly user: UserRepository,
        @Inject('EMAIL_SERVICE')
        private client: ClientProxy
    ) {}

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        return password;
    }

    async createUser( data : CreateUserData ): Promise<UserResponseData> {
        let user: UserResponseData | null = null;
        try {
            const hashed = await this.hashPassword(data.password);

            const payload = {
                ...data,
                password: hashed
            }

            user = await this.user.create(payload);

            const emailPayload = {
                name: data.name,
                to: data.email,
                subject: 'Welcome to superchef!',
                body: `
                Thank you for registering at superchef. 
                We are excited to have you on board! 
                `
            };

            this.client.emit('send_email', emailPayload);

            return user;
        } catch (error) {
            throw error;
        }
    }
}