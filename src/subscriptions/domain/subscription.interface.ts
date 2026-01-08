export interface Subscription {
    id: number;
    userId: number;
    planId: number;
    stripeSubscriptionId: string | null;
    status: string | null;
    currentPeriodEnd: Date | null;
    createdAt: Date;
    canceledAt: Date | null;
}

export interface SubscriptionRepository {
    findById(id: number): Promise<Subscription | null>;
    findByUserId(userId: number): Promise<Subscription | null>;
    update(id: number, subscription: Partial<Subscription>): Promise<Subscription>;
    delete(id: number): Promise<void>;
}