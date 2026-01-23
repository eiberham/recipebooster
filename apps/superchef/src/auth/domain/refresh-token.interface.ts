export interface RefreshToken {
  id: number;
  userId: number;
  token: string;
  deviceId: string;
  expiresAt: Date;
  deviceType?: string | null;
  deviceName?: string | null;
  createdAt: Date;
}

export type CreateRefreshToken = Omit<
  RefreshToken,
  'id' | 'deviceType' | 'deviceName'
> &
  Partial<Pick<RefreshToken, 'deviceType' | 'deviceName'>>;
export type UpdateRefreshToken = Partial<
  Pick<RefreshToken, 'deviceType' | 'deviceName' | 'id'>
> &
  Omit<RefreshToken, 'deviceType' | 'deviceName' | 'id'>;

export interface RefreshTokenRepository {
  upsert(
    userId: number,
    refreshToken: CreateRefreshToken,
  ): Promise<RefreshToken>;
  find(userId: number, deviceId: string): Promise<RefreshToken | null>;
  delete(userId: number, deviceId: string): Promise<void>;
}
