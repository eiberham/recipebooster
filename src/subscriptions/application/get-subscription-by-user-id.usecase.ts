import { Injectable } from '@nestjs/common'
import type { SubscriptionRepository, Subscription } from '../domain/subscription.interface';

@Injectable()
export class GetSubscriptionByUserIdUsecase{
    constructor(
        private readonly subscriptionRepository: SubscriptionRepository
    ) {}

    async getSubscriptionByUserId(userId: number): Promise<Subscription | null> {
        return this.subscriptionRepository.findByUserId(userId)
    }
}