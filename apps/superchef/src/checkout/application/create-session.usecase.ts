import { Injectable } from '@nestjs/common'
import { StripeService } from '@/stripe/stripe.service';
import { Stripe } from 'stripe';

@Injectable()
export class CreateSessionUsecase {
    constructor(
        private readonly stripeService: StripeService
    ) {}

    async create(customerId: string, priceId: string): Promise<Stripe.Checkout.Session>{
        return this.stripeService.createSession(customerId, priceId)
    }
}