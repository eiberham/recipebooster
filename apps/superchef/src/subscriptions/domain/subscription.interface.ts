import { Prisma } from "generated/prisma/edge";

export interface Subscription {
    id: number;
    userId: number;
    planId: number;
    stripeSubscriptionId: string | null;
    status: string | null;
    currentPeriodEnd: Date | null;
    createdAt: Date;
    canceledAt: Date | null;
    interval: string | null;
}

export interface SubscriptionRepository {
    findBy<T extends Prisma.SubscriptionWhereInput>(query : T): Promise<Subscription | null>;
    update(id: number, subscription: Partial<Subscription>): Promise<Subscription>;
    delete(id: number): Promise<void>;
}