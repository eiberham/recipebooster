import { Controller, Get, Req, Post, Body, Put, Delete, Param, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { CreateIngredient } from '../application/create-ingredient.usecase'
import { UpdateIngredient } from '../application/update-ingredient.usecase';
import { ListIngredients } from '../application/list-ingredients.usecase';
import { GetIngredient } from '../application/get-ingredient.usecase';
import { DeleteIngredient } from '../application/delete-ingredient.usecase';
import { IngredientResponseDto } from './dto/ingredient-response.dto';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import type { Request } from 'express';

@Controller("ingredients")
export class IngredientController {
    constructor(
        private readonly createIngredient: CreateIngredient,
        private readonly updateIngredient: UpdateIngredient,
        private readonly listIngredients: ListIngredients,
        private readonly getIngredient: GetIngredient,
        private readonly deleteIngredient: DeleteIngredient
    ) {}

    @Get()
    async findAll(@Req() request: Request): Promise<IngredientResponseDto[]> {
        return this.listIngredients.findAll();
    }

    @Get(':id')
    async findById(@Req() request: Request, @Param('id', ParseIntPipe) id: number) : Promise<IngredientResponseDto | null> {
        return this.getIngredient.findById(id)
    }

    @Post()
    @ApiBody({ type: CreateIngredientDto })
    async create(@Req() request: Request, @Body(ValidationPipe) ingredient:  CreateIngredientDto): Promise<IngredientResponseDto> {
        return this.createIngredient.create(ingredient)
    }

    @Put(':id')
    @ApiBody({ type: UpdateIngredientDto })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body(ValidationPipe) ingredient:  UpdateIngredientDto
    ) : Promise<IngredientResponseDto>{
        return this.updateIngredient.update(id, ingredient)
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.deleteIngredient.delete(id)
    }
}