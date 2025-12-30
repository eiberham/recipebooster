import { Injectable, Inject } from '@nestjs/common'
import type { IngredientRepository } from '../domain/ingredient.interface';
import type { IngredientResponseDto } from '../controllers/dto/ingredient-response.dto';
import { IngredientNotFoundException } from '../../common/exceptions/indredient-not-found.exception';

@Injectable()
export class GetIngredientUsecase {
    constructor(
        @Inject('INGREDIENT_REPOSITORY') 
        private readonly ingredientRepository: IngredientRepository
    ) {}

    async findById(id: number): Promise<IngredientResponseDto | null> {
        const ingredient = await this.ingredientRepository.findById(id);
        if (!ingredient) {
            throw new IngredientNotFoundException();
        }
        return ingredient;
    }
}