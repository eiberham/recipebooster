import { Controller, Post, Req, Body, ValidationPipe, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/domain/role.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateSessionUsecase } from '../application/create-session.usecase';
import { CreateCustomerUsecase } from '../application/create-customer.usecase';
import { CreateBillingDto } from './dto/create-billing.dto';
import { GetUserByUsecase } from 'src/users/application/get-user-by.usecase';
import { UpdateUserUsecase } from 'src/users/application/update-user.usecase';
import { UserNotFoundException } from 'src/common/exceptions/user-not-found.exception';

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('checkout')
export class CheckoutController {

    constructor(
        private readonly stripeCustomer: CreateCustomerUsecase,
        private readonly stripeSession: CreateSessionUsecase,
        private readonly getUserByUsecase: GetUserByUsecase,
        private readonly updateUserUsecase: UpdateUserUsecase
    ){}

    @Post('billing')
    @HttpCode(HttpStatus.OK)
    @Roles(Role.ADMIN, Role.VIEWER)
    @ApiBody({ type: CreateBillingDto })
    async billing(@Req() request: Request, @Body(ValidationPipe) body: CreateBillingDto): Promise<string | null> {
        try {
            const { authenticated } = request as any
            const { email } = authenticated
            const { priceId } = body

            const user = await this.getUserByUsecase.findBy({ email });
            if (!user) {
                throw new UserNotFoundException()
            }

            const stripeCustomerId = user && 'stripeCustomerId' in user ? user.stripeCustomerId : null
            let customerId: string

            if (stripeCustomerId) {
                customerId = stripeCustomerId
            } else {
                const customer = await this.stripeCustomer.create(email)
                customerId = customer.id

                await this.updateUserUsecase.updateUser(user.id, {
                    ...user,
                    stripeCustomerId: customerId
                })
            }

            // price_1SkwdzBc2oUNTGy2w1nInsn9
            const session = await this.stripeSession.create(customerId, priceId)
            return session.url
        } catch (error) {
            console.error('Error in billing endpoint:', error)
            throw error
        }
    }
}