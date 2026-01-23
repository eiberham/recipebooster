import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  Subscription,
  SubscriptionRepository,
} from '../domain/subscription.interface';
import { SubscriptionNotFoundException } from '@/common/exceptions/subscription-not-found.exception';
import { Prisma } from 'generated/prisma/edge';

@Injectable()
export class SubscriptionRepositoryImpl implements SubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBy<T extends Prisma.SubscriptionWhereInput>(
    query: T,
  ): Promise<Subscription | null> {
    return this.prisma.subscription.findFirst({
      where: query,
    });
  }

  async update(
    id: number,
    subscription: Partial<Subscription>,
  ): Promise<Subscription> {
    const exists = await this.prisma.subscription.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new SubscriptionNotFoundException();
    }

    const { id: _, createdAt, canceledAt, userId, ...rest } = subscription;

    const data = Object.fromEntries(Object.entries(rest).filter(Boolean));

    return this.prisma.subscription.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.subscription.delete({ where: { id } });
  }
}
