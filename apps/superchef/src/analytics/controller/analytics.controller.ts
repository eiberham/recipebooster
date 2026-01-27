import { Controller, Get, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetTopRecipes } from '../application/get.top.recipes';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { Role } from '@/auth/domain/role.enum';
import { Roles } from '@/auth/decorators/roles.decorator';

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly stats: GetTopRecipes){}

    @HttpCode(HttpStatus.OK)
    @Roles(Role.ADMIN, Role.VIEWER)
    @Get('top-recipes')
    async getTopRecipes() {
        return this.stats.handle();
    }
}