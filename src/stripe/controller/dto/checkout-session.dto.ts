import { Stripe } from 'stripe';

export class CheckoutSessionDto {
    id: string;
    object: string;
    api_version: string;
    created: number;
    data: {
        object: Stripe.Checkout.Session;
    }
    livemode: false;
    pending_webhooks: number;
    request: string | null;
    type: string;
}