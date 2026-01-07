import { Controller, Post, Req, Body, ValidationPipe, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/domain/role.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateSessionUsecase } from '../application/create-session.usecase';
import { CreateCustomerUsecase } from '../application/create-customer.usecase';
import { CreateBillingDto } from './dto/create-billing.dto';
import { GetUserByEmailUsecase } from 'src/users/application/get-user-by-email.usecase';

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('checkout')
export class CheckoutController {

    constructor(
        private readonly createCustomerUsecase: CreateCustomerUsecase,
        private readonly createSessionUsecase: CreateSessionUsecase,
        private readonly getUserByEmailUsecase: GetUserByEmailUsecase
    ){}

    @Post('billing')
    @HttpCode(HttpStatus.OK)
    @Roles(Role.ADMIN, Role.VIEWER)
    @ApiBody({ type: CreateBillingDto })
    async billing(@Req() request: Request, @Body(ValidationPipe) body: CreateBillingDto): Promise<string | null> {
        const { user } = request as any
        const { email } = user
        const { priceId } = body
        const userResult = await this.getUserByEmailUsecase.getUserByEmail(email)
        const stripeCustomerId = userResult && 'stripeCustomerId' in userResult ? userResult.stripeCustomerId : null
        let customerId: string

        if (stripeCustomerId) {
            customerId = stripeCustomerId
        } else {
            const customer = await this.createCustomerUsecase.create(email)
            customerId = customer.id
        }

        // price_1SkwdzBc2oUNTGy2w1nInsn9
        const { url } = await this.createSessionUsecase.create(customerId, priceId)
        return url
    }
}