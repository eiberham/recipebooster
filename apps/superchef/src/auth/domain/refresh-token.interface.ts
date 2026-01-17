export interface RefreshToken {
    id: number;
    userId: number;
    token: string;
    isRevoked: boolean;
    deviceId: string;
    expiresAt: Date;
    deviceType?: string | null;
    deviceName?: string | null;
    createdAt: Date;
}

export type UpdateRefreshToken = Partial<Pick<RefreshToken, 'deviceType' | 'deviceName'>> & Omit<RefreshToken, 'deviceType' | 'deviceName'>;

export interface RefreshTokenRepository {
    upsert(userId: number, refreshToken: RefreshToken): Promise<RefreshToken>;
    find(userId: number, refreshToken: string): Promise<RefreshToken | null>;
    delete(userId: number, refreshToken: string): Promise<void>;
}