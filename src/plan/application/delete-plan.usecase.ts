import { Injectable, Inject } from '@nestjs/common';
import type { PlanRepository } from '../domain/plan.interface';

@Injectable()
export class DeletePlanUsecase {
    constructor(
        @Inject('PLAN_REPOSITORY') 
        private readonly planRepository: PlanRepository
    ) {}

    async deletePlan(id: number): Promise<void> {
        return this.planRepository.delete(id)
    }
}