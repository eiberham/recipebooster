import { Module } from '@nestjs/common';
import { SubscriptionRepositoryImpl } from './infrastructure/prisma-subscription.repository';

@Module({
    providers: [
        {
            provide: 'SUBSCRIPTION_REPOSITORY',
            useClass: SubscriptionRepositoryImpl,
        }
    ],
    exports: [
        'SUBSCRIPTION_REPOSITORY'
    ]
})
export class SubscriptionModule {}