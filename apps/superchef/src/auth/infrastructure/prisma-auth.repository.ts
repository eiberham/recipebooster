import { Injectable } from '@nestjs/common';
import { AuthRepository, AuthTokens } from '../domain/auth.interface';
import { PrismaService } from '@/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PrismaAuthRepository implements AuthRepository {
    constructor(
        private readonly prisma: PrismaService, 
        private readonly configService: ConfigService, 
        private readonly jwtService: JwtService
    ){}

    async generateTokens(userId: number, email: string, roles: string[]): Promise<AuthTokens> {
        const payload = { sub: userId, email, roles }
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, { expiresIn: '15m', secret: this.configService.get<string>('JWT_SECRET') }),
            this.jwtService.signAsync(payload, { expiresIn: '7d', secret: this.configService.get<string>('JWT_REFRESH_SECRET') })
        ])
        return { accessToken, refreshToken }
    }

    async login(
        email: string, 
        password: string, 
        deviceId: string, 
        deviceType: string, 
        deviceName: string): Promise<AuthTokens> {
            throw new Error('Method not implemented.');
    }

    async refreshTokens(userId: number, refreshToken: string): Promise<AuthTokens> {
        throw new Error('Method not implemented.');
    }

    async logout(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}