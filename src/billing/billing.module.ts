import { Module } from '@nestjs/common';
import { BillingController } from './controllers/billing.controller';
import { StripeService } from 'src/stripe/stripe.service';
import { CreateCheckoutUsecase } from './application/create-checkout.usecase';

@Module({
    controllers: [
        BillingController
    ],
    providers: [
        StripeService,
        CreateCheckoutUsecase
    ]
})
export class BillingModule {}