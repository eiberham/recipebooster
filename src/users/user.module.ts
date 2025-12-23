import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { CreateUserUsecase } from './application/create-user.usecase';
import { UpdateUserUsecase } from './application/update-user.usecase';
import { ListUsersUsecase } from './application/list-users.usecase';
import { GetUserUsecase } from './application/get-user.usecase';
import { DeleteUserUsecase } from './application/delete-user.usecase';
import { UserRepositoryImpl } from './infraestructure/prisma-user.repository';
import { PrismaService } from '../prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
    controllers: [UserController],
    providers: [
        CreateUserUsecase,
        UpdateUserUsecase,
        ListUsersUsecase,
        GetUserUsecase,
        DeleteUserUsecase,
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