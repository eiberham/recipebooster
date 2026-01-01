import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { UserRepository, User } from '../domain/user.interface';
import type { CreateUserDto } from '../controllers/dto/create-user.dto';
import type { UserResponseDto } from '../controllers/dto/user-response.dto';
import { UpdateUserDto } from '../controllers/dto/update-user.dto';
import { CacheService } from 'src/redis/redis.service';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const cached = await this.cache.get('users:all');
    if (cached) {
      return JSON.parse(cached);
    }
    const users = await this.prisma.user.findMany({
      relationLoadStrategy: 'join', 
      include: { 
          userRoles: {
            include: { role: true }
          }
      },
      omit: { password: true} 
    });
    await this.cache.set('users:all', JSON.stringify(users));
    return users;
  }

  async findById(id: number): Promise<UserResponseDto | null> {
    const cached = await this.cache.get(`user:${id}`);
    if (cached) {
      return JSON.parse(cached);
    }
    const user = await this.prisma.user.findUnique({
      where: { id },
      relationLoadStrategy: 'join', 
      include: { 
          userRoles: {
            include: { role: true }
          }
      },
    });
    await this.cache.set(`user:${id}`, JSON.stringify(user));
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      relationLoadStrategy: 'join',
      include: { 
          userRoles: {
            include: { role: true }
          }
      }
    });
  }

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const { name, email, username, password, roles, preferences } = data;
    const user = await this.prisma.user.create({
      data: { 
        name, email, username, password,
        ...(preferences && { preferences }),
        userRoles: {
          create: roles?.map(role => ({
            role: {
              connect: { name: role }
            }
          })) || []
        }
      }
    })
    await this.cache.del('users:all');
    return user;
  }

  async update(id: number, data: UpdateUserDto ): Promise<UserResponseDto> {
    const { name, email, username, password, preferences, roles } = data;
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        name, email, username, password,
        ...(preferences && { preferences }),
        userRoles: roles ? {
          deleteMany: {},
          create: roles.map(role => ({
            role: {
              connect: { name: role }
            }
          }))
        } : undefined
      }
    })
    await this.cache.del('users:all');
    await this.cache.del(`user:${id}`);
    return user;
  }

  async delete(id: number): Promise<UserResponseDto> {
    const user = await this.prisma.user.delete({
      where: { id }
    });
    await this.cache.del('users:all');
    await this.cache.del(`user:${id}`);
    return user;
  }
}