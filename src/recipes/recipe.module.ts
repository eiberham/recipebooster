import { Module } from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { RecipeRepositoryImpl } from './repositories/recipe.repository.impl';
import { PrismaService } from '../prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
    controllers: [RecipeController],
    providers: [
        RecipeService,
        PrismaService,
        {
            provide: 'RECIPE_REPOSITORY',
            useClass: RecipeRepositoryImpl,
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ]
})
export class RecipeModule {}