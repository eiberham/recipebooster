import { Recipe, RecipeRepository } from "../interfaces/recipe.interface";
import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from "@nestjs/common";
import type { CreateRecipeDTO } from "../dto/create-recipe.dto";
import type { UpdateRecipeDTO } from "../dto/update-recipe.dto";

@Injectable()
export class RecipeRepositoryImpl implements RecipeRepository {
    constructor(private readonly prisma: PrismaService) {}

    // Implement repository methods here
    async findAll(): Promise<Recipe[]> {
        return this.prisma.recipe.findMany();
    }
    async findById(id: number): Promise<Recipe | null> {
        return this.prisma.recipe.findUnique({
            where: { id }
        });
    }
    async create(recipe: CreateRecipeDTO): Promise<Recipe> {
        return this.prisma.recipe.create({
            data: recipe
        });
    }
    async update(id: number, recipe: UpdateRecipeDTO): Promise<Recipe> {
        return this.prisma.recipe.update({
            where: { id },
            data: recipe
        });
    }
    async delete(id: number): Promise<void> {
        await this.prisma.recipe.delete({
            where: { id }
        });
    }
}