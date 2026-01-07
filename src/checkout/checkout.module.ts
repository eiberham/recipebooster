import { Module } from '@nestjs/common';
import { CheckoutController } from './controllers/checkout.controller';
import { StripeService } from 'src/stripe/stripe.service';
import { CreateSessionUsecase } from './application/create-session.usecase';
import { CreateCustomerUsecase } from './application/create-customer.usecase';
import { GetUserByEmailUsecase } from 'src/users/application/get-user-by-email.usecase';
import { StripeModule } from 'src/stripe/stripe.module';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/users/user.module';

@Module({
    imports: [
        StripeModule.forRootAsync(),
        UserModule
    ],
    controllers: [
        CheckoutController
    ],
    providers: [
        StripeService,
        CreateSessionUsecase,
        CreateCustomerUsecase,
        GetUserByEmailUsecase,
        JwtService
    ]
})
export class CheckoutModule {}