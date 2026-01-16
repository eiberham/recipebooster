import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiBody } from '@nestjs/swagger'
import { AuthService } from '../auth.service'
import { AuthDto } from './dto/auth.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { AuthTokens } from '../domain/auth.interface'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiBody({ type: AuthDto })
    async login(@Body() authDto: AuthDto): Promise<AuthTokens> {
        const { accessToken, refreshToken } = await this.authService.login(authDto.email, authDto.password);
        return { accessToken, refreshToken }
    }

    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    @ApiBody({ type: RefreshTokenDto })
    async refresh(@Body() refreshDto: RefreshTokenDto ): Promise<AuthTokens> {
        const { accessToken, refreshToken } = await this.authService.refreshTokens(refreshDto.userId, refreshDto.refreshToken);
        return { accessToken, refreshToken }
    }

    @HttpCode(HttpStatus.OK)
    @Post('logout')
    async logout(): Promise<void> {
        return this.authService.logout()
    }
}
