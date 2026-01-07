import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('stripe')
export class StripeController {
    @Post('webhook')
    @HttpCode(HttpStatus.OK)
    handle(@Body() body: any): void {
        // Handle Stripe webhook events here
        // stripe listen --forward-to localhost:3000/stripe/webhook
        // stripe trigger checkout.session.completed

        console.log('Received stripe webhook:', body);
    }
}