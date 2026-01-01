import { Injectable } from '@nestjs/common';
import type { Plan, PlanRepository } from '../domain/plan.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { PlanResponseDto } from '../controllers/dto/plan-response.dto';
import { CacheService } from 'src/redis/redis.service';
import { CreatePlanDto } from '../controllers/dto/create-plan.dto';
import { UpdatePlanDto } from '../controllers/dto/update-plan.dto';

@Injectable()
export class PrismaPlanRepository implements PlanRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cache: CacheService
    ) {}

    async findAll(): Promise<PlanResponseDto[]> {
        const cached = await this.cache.get('plans:all')
        if (cached) {
            return JSON.parse(cached)
        }
        const plans = await this.prisma.plan.findMany()
        await this.cache.set('plans:all', JSON.stringify(plans))
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

    async create( data: CreatePlanDto ): Promise<PlanResponseDto> {
        const plan = await this.prisma.plan.create({
            data,
        })

        await this.cache.del('plans:all')

        return plan
    }

    async update( id: number, data: UpdatePlanDto ): Promise<PlanResponseDto> {
        const plan =  await this.prisma.plan.update({
            where: { id },
            data,
        })

        await this.cache.del('plans:all')
        await this.cache.del(`plan:${id}`)

        return plan
    }

    async delete( id: number ): Promise<void> {
        await this.prisma.plan.delete({
            where: { id },
        })

        await this.cache.del('plans:all')
        await this.cache.del(`plan:${id}`)
    }
}