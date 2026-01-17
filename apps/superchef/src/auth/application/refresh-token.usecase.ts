import { Inject } from '@nestjs/common';
import { PrismaRefreshTokenRepository } from '../infrastructure/prisma-refresh-token.repository';
import { RefreshToken, UpdateRefreshToken } from '../domain/refresh-token.interface';

export class RefreshTokenUsecase {
    constructor(
        @Inject(PrismaRefreshTokenRepository)
        private readonly token: PrismaRefreshTokenRepository
    ) {}
    
    async execute(userId: number, data: UpdateRefreshToken): Promise<RefreshToken> {
        return this.token.upsert(userId, data);
    }
}