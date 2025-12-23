import { Injectable, Inject } from '@nestjs/common';
import type { RecipeRepository } from '../domain/recipe.interface';

@Injectable()
export class DeleteRecipeUsecase{
    constructor(
        @Inject('RECIPE_REPOSITORY') 
        private readonly recipeRepository: RecipeRepository
    ) {}

    async deleteRecipe(id: number): Promise<void> {
        return this.recipeRepository.delete(id)
    }
}