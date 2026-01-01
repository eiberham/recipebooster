import { Injectable } from '@nestjs/common';
import type { Plan, PlanRepository } from '../domain/plan.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { PlanResponseDto } from '../controllers/dto/plan-response.dto';
import { CacheService } from 'src/redis/redis.service';

@Injectable()
export class PrismaPlanRepository implements PlanRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cache: CacheService
    ) {}

    async findAll(): Promise<PlanResponseDto[]> {
        const plans = await this.prisma.plan.findMany()
        return plans
    }

    async findById(id: number): Promise<PlanResponseDto | null> {
        const plan = await this.prisma.plan.findUnique({
            where: { id },
        })

        if (!plan) {
            return null
        }

        return plan
    }

    async findByName(name: string): Promise<Plan | null> {
        const plan = await this.prisma.plan.findUnique({
            where: { name },
        })

        if (!plan) {
            return null
        }

        return plan
    }
}