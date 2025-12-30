import { Injectable, Inject } from '@nestjs/common';
import type { RecipeRepository } from '../domain/recipe.interface';
import { RecipeNotFoundException } from '../../common/exceptions/recipe-not-found.exception';
import { Prisma } from 'generated/prisma/client';


@Injectable()
export class DeleteRecipeUsecase{
    constructor(
        @Inject('RECIPE_REPOSITORY') 
        private readonly recipeRepository: RecipeRepository
    ) {}

    async deleteRecipe(id: number): Promise<void> {
        try {
            await this.recipeRepository.delete(id)
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
                throw new RecipeNotFoundException();
            }
            throw e;
        }
    }
}