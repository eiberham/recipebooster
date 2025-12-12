import { IsNotEmpty } from "class-validator";

export class UpdateRecipeDto {
    @IsNotEmpty()
    name: string;
    description: string;
    steps: string;
    imageUrl: string;

    @IsNotEmpty()
    userId: number;
}