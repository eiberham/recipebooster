import { IsNotEmpty } from "class-validator";

export class CreateRecipeDTO {
    @IsNotEmpty()
    name: string;
    description: string;
    steps: string;
    imageUrl: string;

    @IsNotEmpty()
    userId: number;
}