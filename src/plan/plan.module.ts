import { Module } from '@nestjs/common';
import { PlanController } from './controllers/plan.controller';
import { GetPlanByNameUsecase } from './application/get-plan-by-name.usecase';

@Module({
  controllers: [PlanController],
  providers: [
    GetPlanByNameUsecase
],
})
export class PlanModule {}