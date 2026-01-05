import { Controller, Post, Body, ValidationPipe, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/domain/role.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateCheckoutUsecase } from '../application/create-checkout.usecase';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('billing')
export class BillingController {

    constructor(private readonly createCheckoutUsecase: CreateCheckoutUsecase){}

    @Post('checkout')
    @HttpCode(HttpStatus.OK)
    @Roles(Role.ADMIN, Role.VIEWER)
    @ApiBody({ type: CreateCheckoutDto })
    async checkout(@Body(ValidationPipe) body: CreateCheckoutDto): Promise<void> {
        await this.createCheckoutUsecase.create(body.customerId, body.priceId)
    }
}