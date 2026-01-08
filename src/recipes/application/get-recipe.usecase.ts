import { Injectable, Inject } from '@nestjs/common';
import type { RecipeRepository, Recipe } from '../domain/recipe.interface';
import { RecipeNotFoundException } from '../../common/exceptions/recipe-not-found.exception';

@Injectable()
export class GetRecipeUsecase{
    constructor(
        @Inject('RECIPE_REPOSITORY') 
        private readonly recipe: RecipeRepository
    ) {}

    async getRecipeById(id: number): Promise<Recipe| null> {
        const recipe = await this.recipe.findById(id)
        if (!recipe) {
            throw new RecipeNotFoundException()
        }
        return recipe;
    }
}