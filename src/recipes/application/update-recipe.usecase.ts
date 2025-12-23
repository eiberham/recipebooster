import { Injectable, Inject } from '@nestjs/common';
import type { RecipeRepository } from '../domain/recipe.interface';
import type { RecipeResponseDto } from '../controllers/dto/recipe-response.dto';
import { UpdateRecipeDto } from '../controllers/dto/update-recipe.dto';

@Injectable()
export class UpdateRecipeUsecase{
    constructor(
        @Inject('RECIPE_REPOSITORY') 
        private readonly recipeRepository: RecipeRepository
    ) {}

    async updateRecipe(id: number, recipeData: UpdateRecipeDto): Promise<RecipeResponseDto> {
        return this.recipeRepository.update(id, recipeData)
    }
}