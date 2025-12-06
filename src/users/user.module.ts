import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepositoryImpl } from './repositories/user.repository.impl';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [UserController],
    providers: [
        UserService,
        PrismaService,
        {
            provide: 'USER_REPOSITORY',
            useClass: UserRepositoryImpl,
        },
    ]
})
export class UserModule{}