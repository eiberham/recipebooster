import { Injectable, Inject } from '@nestjs/common';
import type { RecipeRepository, Recipe } from '../domain/recipe.interface';

@Injectable()
export class GetRecipeByNameUsecase{
    constructor(
        @Inject('RECIPE_REPOSITORY') 
        private readonly recipeRepository: RecipeRepository
    ) {}

    async getRecipeByName(name: string): Promise<Recipe | null> {
        return this.recipeRepository.findByName(name)
    }
}