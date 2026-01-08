import { Injectable } from '@nestjs/common';
import { StripeService } from '../stripe.service';
import { Stripe } from 'stripe';
import { GetSubscriptionByUserIdUsecase } from 'src/subscriptions/application/get-subscription-by-user-id.usecase';
import { UpdateSubscriptionUsecase } from 'src/subscriptions/application/update-subscription.usecase';
import { SubscriptionNotFoundException } from 'src/common/exceptions/subscription-not-found.exception';
import { UpdateUserUsecase } from 'src/users/application/update-user.usecase';

@Injectable()
export class HandleCheckoutUsecase {
    constructor(
        private readonly stripe: StripeService,
        private readonly getSubscriptionByUserIdUsecase: GetSubscriptionByUserIdUsecase,
        private readonly updateSubscriptionUsecase: UpdateSubscriptionUsecase,
        private readonly updateUserUsecase: UpdateUserUsecase
    ) {}

    async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
        const { id: sessionId, customer: stripeCustomerId, amount_total, currency, metadata, subscription: stripeSubscriptionId } = session
        // const { userId } = metadata
        const userId = 1

        const lineItems = await this.stripe.getLineItems(sessionId)
        const price= lineItems?.[0].price
        let interval: string

        if (price?.type === 'recurring' && price.recurring) {
            interval = price.recurring.interval;  // 'month', 'year'

            const subscription = await this.getSubscriptionByUserIdUsecase.getSubscriptionByUserId(Number(userId))

            if (!subscription) {
                throw new SubscriptionNotFoundException();
            }

            const now = Date.now()

            const updateTo = {
                ...subscription,
                stripe_subscription_id: stripeSubscriptionId as string,
                current_period_end: new Date(now + (interval === 'month' ? 30 : 365) * 24 * 60 * 60 * 1000),
                status: 'active',
                interval: interval
            }

            console.log('Updating subscription to:', updateTo)

            /* try {
                await Promise.all([
                    this.updateUserUsecase.updateUser(Number(userId), {
                        stripeCustomerId: stripeCustomerId as string
                    }),
                    this.updateSubscriptionUsecase.update(subscription!.id, updateTo)
                ])
            } catch (error) {
                console.error('Error updating subscription after checkout session completed:', error)
            } */

            // fill stripe_subscription_id in table subscription
            // fill current_period_end in table subscription
            // update the user's subscription status to 'active'
            // in order to update the corresponding row in the subscription table, rely on the user id

        }
    }
}