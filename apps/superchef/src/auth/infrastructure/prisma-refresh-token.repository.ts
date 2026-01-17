import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository, RefreshToken, UpdateRefreshToken } from '../domain/refresh-token.interface';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
    constructor(private readonly prisma: PrismaService) {}

    async upsert(userId: number, data: UpdateRefreshToken): Promise<RefreshToken> {
        return this.prisma.refreshToken.upsert({
            where: { userId, token: data.token },
            update: { token: data.token },
            create: { 
                userId, 
                token: data.token, 
                expiresAt: data.expiresAt!, 
                deviceId: data.deviceId! 
            }
        })
    }

    async find(userId: number, refreshToken: string): Promise<RefreshToken | null> {
        return this.prisma.refreshToken.findFirst({
            where: { userId, token: refreshToken }
        })
    }

    async delete(userId: number, refreshToken: string): Promise<void> {
        await this.prisma.refreshToken.deleteMany({
            where: { userId, token: refreshToken }
        })
    }

}