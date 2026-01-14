import { Module, DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { StripeController } from './controller/stripe.controller';
import { CheckoutSessionCompletedUsecase } from './application/checkout-session-completed.usecase';
import { InvoicePaymentFailedUsecase } from './application/invoice-payment-failed.usecase';
import { GetSubscriptionByUsecase } from '@/subscriptions/application/get-subscription-by.usecase';
import { UpdateSubscriptionUsecase } from '@/subscriptions/application/update-subscription.usecase';
import { UpdateUserUsecase } from '@/users/application/update-user.usecase';
import { GetUserByUsecase } from '@/users/application/get-user-by.usecase';
import { SubscriptionModule } from '@/subscriptions/subscription.module';
import { UserModule } from '@/users/user.module';
import { GetPlanByUsecase } from '@/plan/application/get-plan-by.usecase';
import { PlanModule } from '@/plan/plan.module';

@Module({})
export class StripeModule {
    static forRootAsync(): DynamicModule {
        return {
            module: StripeModule,
            imports: [SubscriptionModule, UserModule, PlanModule],
            controllers: [StripeController],
            providers: [
                GetSubscriptionByUsecase,
                GetUserByUsecase,
                UpdateSubscriptionUsecase,
                UpdateUserUsecase,
                CheckoutSessionCompletedUsecase,
                InvoicePaymentFailedUsecase,
                GetPlanByUsecase,
                StripeService,
                {
                    provide: 'STRIPE_API_KEY',
                    useFactory: async (configService: ConfigService) => configService.get<string>('STRIPE_API_KEY'),
                    inject: [ConfigService],
                }
            ],
            exports: [StripeService, 'STRIPE_API_KEY', CheckoutSessionCompletedUsecase, InvoicePaymentFailedUsecase],
        };
    }
}