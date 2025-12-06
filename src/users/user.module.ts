import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepositoryImpl } from './repositories/user.repository.impl';
import { PrismaService } from '../prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
    controllers: [UserController],
    providers: [
        UserService,
        PrismaService,
        {
            provide: 'USER_REPOSITORY',
            useClass: UserRepositoryImpl,
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ]
})
export class UserModule{}