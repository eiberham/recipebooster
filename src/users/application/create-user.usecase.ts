import bcrypt from 'bcrypt';
import { Injectable, Inject } from '@nestjs/common';
import type { UserRepository } from '../domain/user.interface';
import { UserResponseData } from '../domain/user.interface';
import { CreateUserData } from '../domain/user.interface';
import type { NotificationService } from '../domain/notification.interface';

@Injectable()
export class CreateUserUsecase{
    constructor(
        @Inject('USER_REPOSITORY') 
        private readonly user: UserRepository,
        @Inject('NOTIFICATION_SERVICE')
        private notification: NotificationService,
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

            await this.notification.send(
                user, 
                'Welcome to superchef!', 
                `
                Thank you for registering at superchef. 
                We are excited to have you on board! 
                `
            );

            return user;
        } catch (error) {
            throw error;
        }
    }
}