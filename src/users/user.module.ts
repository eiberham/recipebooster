import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { CreateUserUsecase } from './application/create-user.usecase';
import { UpdateUserUsecase } from './application/update-user.usecase';
import { ListUsersUsecase } from './application/list-users.usecase';
import { DeleteUserUsecase } from './application/delete-user.usecase';
import { GetUserByUsecase } from './application/get-user-by.usecase';
import { UserRepositoryImpl } from './infrastructure/prisma-user.repository';
import { RabbitMQNotificationService } from './infrastructure/rabbitmq-notification.service';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitMQProducer } from '@/rabbitmq/rabbitmq.producer';
import { RabbitMQService } from '@/rabbitmq/rabbitmq.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { CacheService } from '@/redis/redis.service';
import { PlanModule } from '@/plan/plan.module';

@Module({
    controllers: [UserController],
    imports: [PlanModule],
    providers: [
        CacheService,
        JwtService,
        CreateUserUsecase,
        UpdateUserUsecase,
        ListUsersUsecase,
        DeleteUserUsecase,
        GetUserByUsecase,
        PrismaService,
        RabbitMQProducer,
        RabbitMQService,
        AuthGuard,
        {
            provide: 'USER_REPOSITORY',
            useClass: UserRepositoryImpl,
        },
        {
            provide: 'NOTIFICATION_SERVICE',
            useClass: RabbitMQNotificationService,
        }
    ],
    exports: ['USER_REPOSITORY', 'NOTIFICATION_SERVICE'],
})
export class UserModule{}