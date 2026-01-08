import { Injectable } from '@nestjs/common'
import type { Subscription, SubscriptionRepository } from '../domain/subscription.interface'

@Injectable()
export class UpdateSubscriptionUsecase{
    constructor(private readonly subscriptionRepository: SubscriptionRepository) {}
    async update(id: number, subscription: Subscription): Promise<Subscription> {
        return this.subscriptionRepository.update(id, subscription);
    }
}