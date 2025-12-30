import { Injectable, Inject } from '@nestjs/common';
import type { RecipeRepository } from '../domain/recipe.interface';
import type { RecipeResponseDto } from '../controllers/dto/recipe-response.dto';
import { RecipeNotFoundException } from '../../common/exceptions/recipe-not-found.exception';

@Injectable()
export class GetRecipeUsecase{
    constructor(
        @Inject('RECIPE_REPOSITORY') 
        private readonly recipeRepository: RecipeRepository
    ) {}

    async getRecipeById(id: number): Promise<RecipeResponseDto | null> {
        const recipe = await this.recipeRepository.findById(id)
        if (!recipe) {
            throw new RecipeNotFoundException()
        }
        return recipe;
    }
}