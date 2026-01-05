import { Injectable } from '@nestjs/common'
import { StripeService } from 'src/stripe/stripe.service';
import { Stripe } from 'stripe';

@Injectable()
export class CreateCheckoutUsecase {
    constructor(
        private readonly stripeService: StripeService
    ) {}

    async create(customerId: string, priceId: string): Promise<Stripe.Checkout.Session>{
        return this.stripeService.createSession(customerId, priceId)
    }
}