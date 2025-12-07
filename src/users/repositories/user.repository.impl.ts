import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // You'll need to create this
import type { User, UserRepository } from '../interfaces/user.interface';
import type { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  async create(userData: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: userData
    });
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: userData
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id }
    });
  }
}