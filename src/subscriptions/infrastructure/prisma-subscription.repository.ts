import { PrismaService } from 'src/prisma/prisma.service';
import { Subscription, SubscriptionRepository } from '../domain/subscription.interface';
import { SubscriptionNotFoundException } from 'src/common/exceptions/subscription-not-found.exception';

export class SubscriptionRepositoryImpl implements SubscriptionRepository {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async findById(id: number): Promise<Subscription | null> {
        return this.prisma.subscription.findUnique({
            where: { id },
        })
    }

    async findByUserId(userId: number): Promise<Subscription | null> {
        return this.prisma.subscription.findUnique({
            where: { userId },
        })
    }

    async update(id: number, subscription: Partial<Subscription>): Promise<Subscription> {
        const exists = await this.prisma.subscription.findUnique({
            where: { id }
        })

        if (!exists) {
            throw new SubscriptionNotFoundException();
        }

        const {id: _, createdAt, canceledAt, userId, planId, ...rest} = subscription

        const data = Object.fromEntries(
            Object.entries(rest).filter(Boolean)
        )

        return this.prisma.subscription.update({
            where: { id },
            data
        })
    }

    async delete(id: number): Promise<void> {
        await this.prisma.subscription.delete({ where: { id } })
    }
}