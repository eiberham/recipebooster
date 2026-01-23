import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatController } from './controller/chat.controller';
import { AgentUseCase } from './application/agent.usecase';
import { RecipeRepositoryImpl } from '@/recipes/infrastructure/prisma-recipe.repository';
import { GetRecipeByUsecase } from '@/recipes/application/get-recipe-by.usecase';

import { JwtService } from '@nestjs/jwt';
import { CacheService } from '@/redis/redis.service';

@Module({
  controllers: [ChatController],
  providers: [
    CacheService,
    JwtService,
    PrismaService,
    {
      provide: 'RECIPE_REPOSITORY',
      useClass: RecipeRepositoryImpl,
    },
    AgentUseCase,
    GetRecipeByUsecase,
  ],
})
export class ChatModule {}
