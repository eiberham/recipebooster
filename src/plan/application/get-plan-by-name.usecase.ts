import { Injectable, Inject } from '@nestjs/common';
import type { PlanRepository } from '../domain/plan.interface';
import type { Plan } from '../domain/plan.interface';

@Injectable()
export class GetPlanByNameUsecase {
    constructor(
        @Inject('PLAN_REPOSITORY') 
        private readonly planRepository: PlanRepository
    ) {}

    async getPlanByName(name: string): Promise<Plan | null> {
        return this.planRepository.findByName(name)
    }
}