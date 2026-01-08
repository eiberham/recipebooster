import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { CheckoutSessionDto } from '../controller/dto/checkout-session.dto'
import { HandleCheckoutUsecase } from '../application/handle-checkout.usecase'
import { Stripe } from 'stripe';

@Controller('stripe')
export class StripeController {

    constructor(
        private readonly handleCheckoutUsecase: HandleCheckoutUsecase
    ) {}

    @Post('webhook')
    @HttpCode(HttpStatus.OK)
    async handle(@Body() body: CheckoutSessionDto): Promise<void> {
        // stripe listen --forward-to localhost:3000/stripe/webhook
        // stripe trigger checkout.session.completed

        try {
            console.log('Event:', body)
            const { type } = body
            switch( type ) {
                case 'checkout.session.completed':
                    const event: Stripe.Checkout.Session = body.data.object
                    await this.handleCheckoutUsecase.handleCheckoutSessionCompleted(event)
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