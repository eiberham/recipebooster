import { RecipeRepository } from "../domain/recipe.interface";
import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from "@nestjs/common";
import type { CreateRecipeDto } from "../controllers/dto/create-recipe.dto";
import type { UpdateRecipeDto } from "../controllers/dto/update-recipe.dto";
import type { RecipeResponseDto } from "../controllers/dto/recipe-response.dto";

@Injectable()
export class RecipeRepositoryImpl implements RecipeRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<RecipeResponseDto[]> {
        return this.prisma.recipe.findMany();
    }
    async findById(id: number): Promise<RecipeResponseDto | null> {
        return this.prisma.recipe.findUnique({
            where: { id }
        });
    }
    async create(recipe: CreateRecipeDto): Promise<RecipeResponseDto> {
        return this.prisma.recipe.create({
            data: recipe
        });
    }
    async update(id: number, recipe: UpdateRecipeDto): Promise<RecipeResponseDto> {
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