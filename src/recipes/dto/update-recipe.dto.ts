import { IsNotEmpty } from "class-validator";

export class UpdateRecipeDTO {
    @IsNotEmpty()
    name: string;
    description: string;
    steps: string;
    imageUrl: string;

    @IsNotEmpty()
    userId: number;
}