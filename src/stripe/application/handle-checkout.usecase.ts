import { Injectable } from '@nestjs/common';
import { StripeService } from '../stripe.service';
import { Stripe } from 'stripe';
import { GetSubscriptionByUsecase } from '@/subscriptions/application/get-subscription-by.usecase';
import { UpdateSubscriptionUsecase } from '@/subscriptions/application/update-subscription.usecase';
import { SubscriptionNotFoundException } from '@/common/exceptions/subscription-not-found.exception';
import { UpdateUserUsecase } from '@/users/application/update-user.usecase';
import { GetUserByUsecase } from '@/users/application/get-user-by.usecase';
import { GetPlanByUsecase } from '@/plan/application/get-plan-by.usecase';

@Injectable()
export class HandleCheckoutUsecase {
    constructor(
        private readonly stripe: StripeService,
        private readonly getSubscriptionByUsecase: GetSubscriptionByUsecase,
        private readonly updateSubscriptionUsecase: UpdateSubscriptionUsecase,
        private readonly updateUserUsecase: UpdateUserUsecase,
        private readonly getUserByUsecase: GetUserByUsecase,
        private readonly getPlanByUsecase: GetPlanByUsecase
    ) {}

    async checkoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
        const { id: sessionId, customer: stripeCustomerId, amount_total, currency, subscription: stripeSubscriptionId } = session
        
        const user = await this.getUserByUsecase.findBy({ stripeCustomerId: stripeCustomerId as string })
        const userId = user?.id

        const items = await this.stripe.getLineItems(sessionId)
        const price= items?.[0].price

        let interval: string

        if (price?.type === 'recurring' && price.recurring) {
            interval = price.recurring.interval;  // 'month', 'year'

            const plan = await this.getPlanByUsecase.findBy({ stripePriceId: price.id })

            const subscription = await this.getSubscriptionByUsecase.getSubscriptionBy({ userId: Number(userId) })
            
            if (!subscription) {
                throw new SubscriptionNotFoundException()
            }

            const now = Date.now()

            const updateTo = {
                ...subscription,
                stripeSubscriptionId: stripeSubscriptionId as string,
                currentPeriodEnd: new Date(now + (interval === 'month' ? 30 : 365) * 24 * 60 * 60 * 1000),
                status: 'active',
                interval: interval,
                planId: plan?.id ? plan.id : subscription.planId
            }

            try {
                await Promise.all([
                    this.updateUserUsecase.updateUser(Number(userId), {
                        stripeCustomerId: stripeCustomerId as string
                    }),
                    this.updateSubscriptionUsecase.update(subscription!.id, updateTo)
                ])
            } catch (error) {
                console.error('Error updating subscription after checkout session completed:', error)
            }

        }
    }
}