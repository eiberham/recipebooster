import { PlanResponseDto } from "../controllers/dto/plan-response.dto";

export interface PlanRepository {
    findById(id: number): Promise<PlanResponseDto | null>;
    findAll(): Promise<PlanResponseDto[]>;
    findByName(name: string): Promise<Plan | null>;
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