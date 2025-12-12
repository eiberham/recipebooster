import { IsNotEmpty } from "class-validator";

export class CreateRecipeDto {
    @IsNotEmpty()
    name: string;
    description: string;
    steps: string;
    imageUrl: string;

    @IsNotEmpty()
    userId: number;
}