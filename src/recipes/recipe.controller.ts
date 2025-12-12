import { Controller, ParseIntPipe, ValidationPipe, Get, Req, Param, Body, Post, Put, Delete } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import type { Request } from 'express';
import type { RecipeResponseDto } from './dto/recipe-response.dto';
import type { CreateRecipeDto } from './dto/create-recipe.dto';
import type { UpdateRecipeDto } from './dto/update-recipe.dto';

@Controller('recipes')
export class RecipeController {
    constructor(private readonly recipeService: RecipeService) {}

    @Get()
    async getRecipes( @Req() req: Request ): Promise<RecipeResponseDto[]> {
        return this.recipeService.getRecipes();
    }
    
    @Get(':id')
    async getRecipeById( @Req() req: Request, @Param('id', ParseIntPipe) id: number ): Promise<RecipeResponseDto | null> {
        return this.recipeService.getRecipeById(id);
    }

    @Post()
    async createRecipe( @Body(ValidationPipe) recipeData: CreateRecipeDto ): Promise<RecipeResponseDto> {
        return this.recipeService.createRecipe(recipeData);
    }

    @Put(':id')
    async updateRecipe( @Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) recipeData: UpdateRecipeDto ): Promise<RecipeResponseDto> {
        return this.recipeService.updateRecipe(id, recipeData);
    }

    @Delete(':id')
    async deleteRecipe( @Param('id', ParseIntPipe) id: number ): Promise<void> {
        return this.recipeService.deleteRecipe(id);
    }
}