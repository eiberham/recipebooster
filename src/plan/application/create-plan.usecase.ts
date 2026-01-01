import { Injectable, Inject } from '@nestjs/common';
import type { PlanRepository } from '../domain/plan.interface';
import { PlanResponseDto } from '../controllers/dto/plan-response.dto';
import { CreatePlanDto } from '../controllers/dto/create-plan.dto';

@Injectable()
export class CreatePlanUsecase {
    constructor(
        @Inject('PLAN_REPOSITORY') 
        private readonly planRepository: PlanRepository
    ) {}

    async createPlan(data: CreatePlanDto): Promise<PlanResponseDto> {
        return this.planRepository.create(data)
    }
}