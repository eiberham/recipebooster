import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { CheckoutSessionCompletedUsecase } from '../application/checkout-session-completed.usecase'
import { InvoicePaymentFailedUsecase } from '../application/invoice-payment-failed.usecase';
import { Stripe } from 'stripe';
import { StripeEventType } from '../domain/stripe.interface';

@Controller('stripe')
export class StripeController {

    constructor(
        private readonly checkoutSessionCompleted: CheckoutSessionCompletedUsecase,
        private readonly invoicePaymentFailed: InvoicePaymentFailedUsecase
    ) {}

    @Post('webhook')
    @HttpCode(HttpStatus.OK)
    async handle(@Body() body: any): Promise<void> {
        // stripe listen --forward-to localhost:3000/stripe/webhook
        // stripe trigger checkout.session.completed
        try {
            const { type } = body
            switch( type ) {
                case StripeEventType.CHECKOUT_SESSION_COMPLETED:
                    const sessionEvent: Stripe.Checkout.Session = body.data.object
                    await this.checkoutSessionCompleted.handle(sessionEvent)
                    break
                case StripeEventType.INVOICE_PAYMENT_FAILED:
                    const invoiceEvent = body.data.object
                    await this.invoicePaymentFailed.handle(invoiceEvent)
                    break
                default:
                    console.log(`Unhandled event type: ${type}`)
            }
        } catch( error ){
            console.error('Error handling stripe webhook:', error)
            throw error
        }
    }
}