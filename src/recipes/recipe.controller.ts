import { Controller, Get, Req } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import type { Request } from 'express';
import { Recipe } from './interfaces/recipe.interface';

@Controller('recipes')
export class RecipeController {
    constructor(private readonly recipeService: RecipeService) {}

    @Get()
    async getRecipes( @Req() req: Request ): Promise<Recipe[]> {
        return this.recipeService.getRecipes();
    }
}