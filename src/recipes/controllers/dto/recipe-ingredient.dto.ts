import { IsNumber, IsString } from "class-validator";

export class RecipeIngredient {
    @IsNumber()
    ingredientId: number;

    @IsNumber()
    quantity: number | null;

    @IsString()
    unit: string | null;
}