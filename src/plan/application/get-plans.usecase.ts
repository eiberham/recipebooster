import { Injectable, Inject } from '@nestjs/common';
import type { PlanRepository } from '../domain/plan.interface';
import type { PlanResponseDto } from '../controllers/dto/plan-response.dto';

@Injectable()
export class GetPlansUsecase {
    constructor(
        @Inject('PLAN_REPOSITORY') 
        private readonly planRepository: PlanRepository,
        
    ) {}

    async getPlans(): Promise<PlanResponseDto[]> {
        return this.planRepository.findAll()
    }
}