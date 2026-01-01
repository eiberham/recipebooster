import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { UserRepository, User, Subscription } from '../domain/user.interface';
import type { CreateUserDto } from '../controllers/dto/create-user.dto';
import type { UserResponseDto } from '../controllers/dto/user-response.dto';
import { UpdateUserDto } from '../controllers/dto/update-user.dto';
import { CacheService } from 'src/redis/redis.service';
import { PlanNotFoundException } from 'src/common/exceptions/plan-not-found.exception';
import { UserNotFoundException } from 'src/common/exceptions/user-not-found.exception';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const cached = await this.cache.get('users:all')
    if (cached) {
      return JSON.parse(cached)
    }

    const data = await this.prisma.user.findMany({
      relationLoadStrategy: 'join', 
      include: { 
          roles: {
            include: { 
              role: {
                select: { name: true }
              } 
            }
          },
          subscription: {
            include: {
              plan: {
                select: { name: true }
              }
            }
          }
      },
      omit: { password: true} 
    })

    const users = data.map(
      ({preferences, roles, subscription, ...user}) => ({
        ...user,
        preferences: preferences ?? { diet: 'none', allergies: [] },
        roles: roles?.map((ur) => ur.role.name) || [],
        subscription: (subscription?.plan.name ?? 'free') as Subscription
      })
    )

    await this.cache.set('users:all', JSON.stringify(users))

    return users
  }

  async findById(id: number): Promise<UserResponseDto | null> {
    const cached = await this.cache.get(`user:${id}`)
    if (cached) {
      return JSON.parse(cached)
    }

    const data = await this.prisma.user.findUnique({
      where: { id },
      relationLoadStrategy: 'join', 
      include: { 
        roles: {
          include: { role: true }
        },
        subscription: {
          include: {
            plan: {
              select: { name: true }
            }
          }
        }
      },
    })

    const user = data ? {
      ...data,
      preferences: data.preferences ?? { diet: 'none', allergies: [] },
      roles: data.roles?.map(ur => ur.role.name) || [],
      subscription: (data.subscription?.plan.name ?? 'free') as Subscription
    } : null

    await this.cache.set(`user:${id}`, JSON.stringify(user))

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: { email },
      relationLoadStrategy: 'join',
      include: { 
        roles: {
          include: { role: true }
        },
        subscription: {
          include: {
            plan: {
              select: { name: true }
            }
          }
        }
      }
    })

    if (!data) return null;

    return {
      ...data,
      preferences: data.preferences ?? { diet: 'none', allergies: [] },
      roles: data.roles?.map(ur => ur.role.name) || [],
      subscription: (data.subscription?.plan.name ?? 'free') as Subscription
    }
  }

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const { name, email, username, password, roles, preferences, subscription } = data;
    
    const plan = subscription && await this.prisma.plan.findUnique({
      where: { name: subscription }
    })

    if (subscription && !plan) {
      throw new PlanNotFoundException()
    }

    const user = await this.prisma.user.create({
      data: { 
        name, email, username, password,
        ...(preferences && { preferences }),
        roles: {
          create: roles?.map(role => ({
            role: {
              connect: { name: role }
            }
          })) || []
        },
        subscription: { 
          create: subscription ? {
            status: 'active',
            stripeSubscriptionId: '',
            currentPeriodEnd: '',
            plan: {
              connect: { 
                id: plan!.id, 
                name: subscription,
              }
            }
          } : undefined,
        }
      }
    })

    await this.cache.del('users:all')

    return user
  }

  async update(id: number, data: UpdateUserDto ): Promise<UserResponseDto> {
    const { name, email, username, password, preferences, roles, subscription } = data;

    const plan = subscription && await this.prisma.plan.findUnique({
      where: { name: subscription }
    })

    if (subscription && !plan) {
      throw new PlanNotFoundException()
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        name, email, username, password,
        ...(preferences && { preferences }),
        roles: roles ? {
          deleteMany: {},
          create: roles.map(role => ({
            role: {
              connect: { name: role }
            }
          }))
        } : undefined
      }
    })
    await this.cache.del('users:all')
    await this.cache.del(`user:${id}`)
    return user
  }

  async delete(id: number): Promise<UserResponseDto> {
    let user: UserResponseDto | null;

    const cache = await this.cache.get(`user:${id}`)

    if (cache) {
      user = JSON.parse(cache)
    } else {
      user = await this.prisma.user.findUnique({
        where: { id }
      })
    }

    if (!user) {
      throw new UserNotFoundException()
    }

    user = await this.prisma.user.delete({
      where: { id }
    })

    await this.cache.del('users:all')
    await this.cache.del(`user:${id}`)

    return user
  }
}