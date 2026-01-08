import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { HandleCheckoutUsecase } from '../application/handle-checkout.usecase'
import { Stripe } from 'stripe';

@Controller('stripe')
export class StripeController {

    constructor(
        private readonly handler: HandleCheckoutUsecase
    ) {}

    @Post('webhook')
    @HttpCode(HttpStatus.OK)
    async handle(@Body() body: any): Promise<void> {
        // stripe listen --forward-to localhost:3000/stripe/webhook
        // stripe trigger checkout.session.completed

        try {
            console.log('Event:', body)
            const { type } = body
            switch( type ) {
                case 'checkout.session.completed':
                    const event: Stripe.Checkout.Session = body.data.object
                    await this.handler.checkoutSessionCompleted(event)
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