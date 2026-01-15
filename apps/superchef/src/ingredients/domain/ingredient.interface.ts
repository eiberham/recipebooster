import { Prisma } from "generated/prisma/edge";

export interface Ingredient {
    id: number;
    name: string;
}

export type CreateIngredientData = Omit<Ingredient, 'id'>;
export type UpdateIngredientData = Partial<Omit<Ingredient, 'id'>>;

export interface IngredientRepository {
    findAll(): Promise<Ingredient[]>;
    findById(id: number): Promise<Ingredient | null>;
    findBy<T extends Prisma.IngredientWhereInput>(query : T): Promise<Ingredient | null>;
    create(ingredient: Partial<Ingredient>): Promise<Ingredient>;
    update(id: number, ingredient: Partial<Ingredient>): Promise<Ingredient>;
    delete(id: number): Promise<Ingredient>;
}
