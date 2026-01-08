import { Prisma } from "generated/prisma/edge";

export interface PlanRepository {
    findById(id: number): Promise<Plan | null>;
    findAll(): Promise<Plan[]>;
    findByName(name: string): Promise<Plan | null>;
    findBy<T extends Prisma.PlanWhereInput>(query : T): Promise<Plan | null>;
    create( data: CreatePlanData ): Promise<Plan>;
    update( id: number, data: UpdatePlanData ): Promise<Plan>;
    delete( id: number ): Promise<void>;
}

export type CreatePlanData = Omit<Plan, 'id' | 'createdAt'>;
export type UpdatePlanData = Partial<Omit<Plan, 'id' | 'createdAt'>>;

export interface Plan {
    id: number;
    name: string;
    price: number;
    stripePriceId?: string | null;
    features: any;
    currency: string;
    createdAt: Date;
}