import { Injectable, Inject } from '@nestjs/common';
import type { RecipeRepository } from '../domain/recipe.interface';
import type { RecipeResponseDto } from '../controllers/dto/recipe-response.dto';

@Injectable()
export class GetRecipeUsecase{
    constructor(
        @Inject('RECIPE_REPOSITORY') 
        private readonly recipeRepository: RecipeRepository
    ) {}

    async getRecipeById(id: number): Promise<RecipeResponseDto | null> {
        return this.recipeRepository.findById(id)
    }
}