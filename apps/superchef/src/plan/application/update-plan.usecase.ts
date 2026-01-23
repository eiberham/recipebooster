import { Injectable, Inject } from '@nestjs/common';
import type {
  PlanRepository,
  CreatePlanData,
  Plan,
} from '../domain/plan.interface';

@Injectable()
export class UpdatePlanUsecase {
  constructor(
    @Inject('PLAN_REPOSITORY')
    private readonly plan: PlanRepository,
  ) {}

  async updatePlan(id: number, data: CreatePlanData): Promise<Plan> {
    return this.plan.update(id, data);
  }
}
