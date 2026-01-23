import { RecipeIngredient } from './recipe-ingredient.dto';

export class RecipeResponseDto {
  id: number;
  name: string;
  description: string;
  steps: string;
  imageUrl: string | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date | null;
  ingredients?: RecipeIngredient[];
}
