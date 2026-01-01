import { PlanResponseDto } from "../controllers/dto/plan-response.dto";
import { CreatePlanDto } from "../controllers/dto/create-plan.dto";
import { UpdatePlanDto } from "../controllers/dto/update-plan.dto";

export interface PlanRepository {
    findById(id: number): Promise<PlanResponseDto | null>;
    findAll(): Promise<PlanResponseDto[]>;
    findByName(name: string): Promise<Plan | null>;
    create( data: CreatePlanDto ): Promise<PlanResponseDto>;
    update( id: number, data: UpdatePlanDto ): Promise<PlanResponseDto>;
    delete( id: number ): Promise<void>;
}

export interface Plan {
    id: number;
    name: string;
    price: number;
    stripePriceId: string | null;
    features: unknown;
    currency: string;
    createdAt: Date;
}