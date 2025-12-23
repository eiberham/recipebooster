import { Injectable, Inject } from '@nestjs/common';
import type { RecipeRepository } from '../domain/recipe.interface';
import type { RecipeResponseDto } from '../controllers/dto/recipe-response.dto';
import { CreateRecipeDto } from '../controllers/dto/create-recipe.dto';

@Injectable()
export class CreateRecipeUsecase{
    constructor(
        @Inject('RECIPE_REPOSITORY') 
        private readonly recipeRepository: RecipeRepository
    ) {}

    async createRecipe( recipeData: CreateRecipeDto ): Promise<RecipeResponseDto> {
        return this.recipeRepository.create(recipeData)
    }
}