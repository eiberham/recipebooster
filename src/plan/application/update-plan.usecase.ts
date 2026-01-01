import { Injectable, Inject } from '@nestjs/common';
import type { PlanRepository } from '../domain/plan.interface';
import { PlanResponseDto } from '../controllers/dto/plan-response.dto';
import { CreatePlanDto } from '../controllers/dto/create-plan.dto';

@Injectable()
export class UpdatePlanUsecase {
    constructor(
        @Inject('PLAN_REPOSITORY') 
        private readonly planRepository: PlanRepository
    ) {}

    async updatePlan(id: number, data: CreatePlanDto): Promise<PlanResponseDto> {
        return this.planRepository.update(id, data)
    }
}