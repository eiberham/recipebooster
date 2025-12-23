import { Injectable, Inject } from '@nestjs/common';
import type { RecipeRepository } from '../domain/recipe.interface';
import type { RecipeResponseDto } from '../controllers/dto/recipe-response.dto';

@Injectable()
export class ListRecipesUsecase{
    constructor(
        @Inject('RECIPE_REPOSITORY') 
        private readonly recipeRepository: RecipeRepository
    ) {}

    async getRecipes(): Promise<RecipeResponseDto[]> {
        return this.recipeRepository.findAll();
    }
}