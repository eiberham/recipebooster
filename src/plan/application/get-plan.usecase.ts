import { Injectable, Inject } from '@nestjs/common';
import type { PlanRepository } from '../domain/plan.interface';
import { PlanResponseDto } from '../controllers/dto/plan-response.dto';

@Injectable()
export class GetPlanUsecase {
    constructor(
        @Inject('PLAN_REPOSITORY') 
        private readonly planRepository: PlanRepository
    ) {}

    async getPlan(id: number): Promise<PlanResponseDto | null> {
        return this.planRepository.findById(id)
    }
}