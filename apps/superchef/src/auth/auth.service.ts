import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from "@nestjs/config";
import { JwtService } from '@nestjs/jwt'
import { GetUserByUsecase } from '../users/application/get-user-by.usecase'
import bcrypt from 'bcrypt'
import { AuthTokens } from './domain/auth.interface'

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly getUserByUsecase: GetUserByUsecase,
        private readonly jwtService: JwtService) {}

    async generateTokens(userId: number, email: string, roles: string[]): Promise<AuthTokens> {
        const payload = { sub: userId, email, roles }
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, { expiresIn: '15m', secret: this.configService.get<string>('JWT_SECRET') }),
            this.jwtService.signAsync(payload, { expiresIn: '7d', secret: this.configService.get<string>('JWT_REFRESH_SECRET') })
        ])
        return { accessToken, refreshToken }
    }

    async login(email: string, password: string): Promise<AuthTokens> {
        const user = await this.getUserByUsecase.findBy({email});
        const roles = user?.roles?.map(role => role) || []
        if (!user || !bcrypt.compareSync(password, user.password)) {
            throw new UnauthorizedException('Invalid email or password')
        }

        const payload = { sub: user.id, email: user.email, roles }
        return await this.generateTokens(user.id, user.email, roles)
    }
}
