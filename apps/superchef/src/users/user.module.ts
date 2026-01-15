import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './controllers/user.controller';
import { CreateUserUsecase } from './application/create-user.usecase';
import { UpdateUserUsecase } from './application/update-user.usecase';
import { ListUsersUsecase } from './application/list-users.usecase';
import { DeleteUserUsecase } from './application/delete-user.usecase';
import { GetUserByUsecase } from './application/get-user-by.usecase';
import { UserRepositoryImpl } from './infrastructure/prisma-user.repository';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { CacheService } from '@/redis/redis.service';
import { PlanModule } from '@/plan/plan.module';

@Module({
    controllers: [UserController],
    imports: [
        ClientsModule.register([
            {
                name: 'EMAIL_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://localhost:5672'],
                queue: 'rabbitmq',
                noAssert: true
                },
            },
        ]),
        PlanModule
    ],
    providers: [
        CacheService,
        JwtService,
        CreateUserUsecase,
        UpdateUserUsecase,
        ListUsersUsecase,
        DeleteUserUsecase,
        GetUserByUsecase,
        PrismaService,
        AuthGuard,
        {
            provide: 'USER_REPOSITORY',
            useClass: UserRepositoryImpl,
        },
    ],
    exports: ['USER_REPOSITORY'],
})
export class UserModule{}