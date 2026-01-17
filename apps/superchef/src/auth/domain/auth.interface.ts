export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthRepository {
    generateTokens(userId: number, email: string, roles: string[]): Promise<AuthTokens>;
    login(email: string, password: string, deviceId: string, deviceType: string, deviceName: string): Promise<AuthTokens>;
    refreshTokens(userId: number, refreshToken: string): Promise<AuthTokens>;
    logout(): Promise<void>;
}