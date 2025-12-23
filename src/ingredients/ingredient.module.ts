import { Module } from '@nestjs/common';
import { IngredientController } from './controllers/ingredient.controller';
import { CreateIngredient } from './application/create-ingredient.usecase';
import { UpdateIngredient } from './application/update-ingredient.usecase';
import { ListIngredients } from './application/list-ingredients.usecase';
import { GetIngredient } from './application/get-ingredient.usecase';
import { DeleteIngredient } from './application/delete-ingredient.usecase';
import { IngredientRepositoryImpl } from './infraestructure/prisma-ingredient.repository';
import { PrismaService } from '../prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
    controllers: [IngredientController],
    providers: [
        CreateIngredient,
        UpdateIngredient,
        ListIngredients,
        GetIngredient,
        DeleteIngredient,
        PrismaService,
        {
            provide: 'INGREDIENT_REPOSITORY',
            useClass: IngredientRepositoryImpl,
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ]
})
export class IngredientModule {}