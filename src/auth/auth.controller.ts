import { Controller, Post, Req, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    async login(@Body() authDto: AuthDto): Promise<{ accessToken: string }> {
        const accessToken = await this.authService.login(authDto.email, authDto.password);
        return { accessToken };
    }
}
