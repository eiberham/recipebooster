import { Injectable, Inject } from '@nestjs/common'
import type { IngredientRepository, Ingredient } from '../domain/ingredient.interface';
import { UpdateIngredientData } from '../domain/ingredient.interface';

@Injectable()
export class UpdateIngredientUsecase {
    constructor(
        @Inject('INGREDIENT_REPOSITORY') 
        private readonly ingredient: IngredientRepository
    ) {}

    async update(id: number, data: UpdateIngredientData) : Promise<Ingredient>{
        return this.ingredient.update(id, data)
    }

}