import { Injectable, Inject } from '@nestjs/common';
import type { Recipe, RecipeRepository } from './interfaces/recipe.interface';

@Injectable()
export class RecipeService{
    constructor(
        @Inject('RECIPE_REPOSITORY') 
        private readonly recipeRepository: RecipeRepository
    ) {}

    private readonly recipes: Recipe[] = [];

    async getRecipes(): Promise<Recipe[]> {
        return this.recipeRepository.findAll()
    }
}