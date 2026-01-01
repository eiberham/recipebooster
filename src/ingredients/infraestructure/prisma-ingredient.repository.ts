import { Injectable } from '@nestjs/common';
import type { IngredientRepository } from '../domain/ingredient.interface';
import type { CreateIngredientDto } from '../controllers/dto/create-ingredient.dto';
import type { UpdateIngredientDto } from '../controllers/dto/update-ingredient.dto';
import type { IngredientResponseDto } from '../controllers/dto/ingredient-response.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../redis/redis.service';

@Injectable()
export class IngredientRepositoryImpl implements IngredientRepository {
    constructor( 
        private readonly prisma: PrismaService,
        private readonly cache: CacheService,
    ) {}

    async findAll(): Promise<IngredientResponseDto[]> {
        const cached = await this.cache.get('ingredients:all')
        if (cached) {
            return JSON.parse(cached)
        }

        const ingredients = await this.prisma.ingredient.findMany()
        await this.cache.set('ingredients:all', JSON.stringify(ingredients))
        return ingredients
    }

    async findById(id: number): Promise<IngredientResponseDto | null> {
        const cached = await this.cache.get(`ingredient:${id}`)
        if (cached) {
            return JSON.parse(cached)
        }
        const ingredient = await this.prisma.ingredient.findUnique({
            where: { id }
        })
        await this.cache.set(`ingredient:${id}`, JSON.stringify(ingredient))
        return ingredient
    }

    async create(ingredient: CreateIngredientDto): Promise<IngredientResponseDto> {
        const created = await this.prisma.ingredient.create({
            data: ingredient
        })
        await this.cache.del('ingredients:all')
        return created
    }

    async update(id: number, ingredient: UpdateIngredientDto): Promise<IngredientResponseDto> {
        const updated = await this.prisma.ingredient.update({
            where: { id },
            data: ingredient
        })
        await this.cache.del('ingredients:all')
        await this.cache.del(`ingredient:${id}`)
        return updated
    }

    async delete(id: number): Promise<IngredientResponseDto> {
        const deleted = await this.prisma.ingredient.delete({
            where: { id }
        })
        await this.cache.del('ingredients:all')
        await this.cache.del(`ingredient:${id}`)
        return deleted
    }
}