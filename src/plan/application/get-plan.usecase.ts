import { Injectable, Inject } from '@nestjs/common';
import type { PlanRepository, Plan } from '../domain/plan.interface';

@Injectable()
export class GetPlanUsecase {
    constructor(
        @Inject('PLAN_REPOSITORY') 
        private readonly plan: PlanRepository
    ) {}

    async getPlan(id: number): Promise<Plan | null> {
        return this.plan.findById(id)
    }
}