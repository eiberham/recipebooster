import { RecipeRepository } from "../domain/recipe.interface";
import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from "@nestjs/common";
import type { CreateRecipeDto } from "../controllers/dto/create-recipe.dto";
import type { UpdateRecipeDto } from "../controllers/dto/update-recipe.dto";
import type { RecipeResponseDto } from "../controllers/dto/recipe-response.dto";
import { CacheService } from "src/redis/redis.service";

@Injectable()
export class RecipeRepositoryImpl implements RecipeRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cache: CacheService
    ) {}

    async findAll(): Promise<RecipeResponseDto[]> {
        const cached = await this.cache.get('recipes:all');
        if (cached) {
            return JSON.parse(cached);
        }
        const recipes = await this.prisma.recipe.findMany({
            relationLoadStrategy: 'join',
            include: { 
                ingredients: true
            }
        })
        await this.cache.set('recipes:all', JSON.stringify(recipes));
        return recipes
    }
    async findById(id: number): Promise<RecipeResponseDto | null> {
        const cached = await this.cache.get(`recipe:${id}`);
        if (cached) {
            return JSON.parse(cached);
        }
        const recipe = await this.prisma.recipe.findUnique({
            where: { id }
        })
        await this.cache.set(`recipe:${id}`, JSON.stringify(recipe));
        return recipe
    }
    async findByName(name: string): Promise<RecipeResponseDto | null> {
        return this.prisma.recipe.findFirst({
            where: { name: {
                contains: name,
                mode: 'insensitive'
            } }
        })
    }
    async create(recipe: CreateRecipeDto): Promise<RecipeResponseDto> {
        const { ingredients, ...rest } = recipe
        const created = await this.prisma.recipe.create({
            data: {
                ...rest,
                // recipe_ingredients table relation
                ingredients: ingredients 
                    ? { 
                        create: ingredients.map(ingredient => ({
                            quantity: ingredient.quantity,
                            unit: ingredient.unit,
                            ingredient: {
                                connect: { id: ingredient.ingredientId}
                            }
                        }))
                    }
                    : undefined,
            }
        })
        await this.cache.del('recipes:all')
        return created
    }
    async update(id: number, recipe: UpdateRecipeDto): Promise<RecipeResponseDto> {
        const { ingredients, ...rest } = recipe;
        const updated = await this.prisma.recipe.update({
            where: { id },
            data: {
                ...rest,
                // recipe_ingredients table relation
                ingredients: ingredients 
                    ? { 
                        create: ingredients.map(ingredient => ({
                            quantity: ingredient.quantity,
                            unit: ingredient.unit,
                            ingredient: {
                                connect: { id: ingredient.ingredientId}
                            }
                        }))
                    }
                    : undefined,
            }
        })
        await this.cache.del('recipes:all')
        await this.cache.del(`recipe:${id}`)
        return updated
    }
    async delete(id: number): Promise<RecipeResponseDto> {
        const deleted = await this.prisma.recipe.delete({
            where: { id }
        });
        await this.cache.del('recipes:all')
        await this.cache.del(`recipe:${id}`)
        return deleted
    }
}