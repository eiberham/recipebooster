import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AgentUseCase } from '../application/agent.usecase';
import { ChatDto } from './dto/chat-dto';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Role } from '@/auth/domain/role.enum';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { AuthGuard } from '@/auth/guards/auth.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly agent: AgentUseCase) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiBody({ type: ChatDto })
  async chat(@Body(ValidationPipe) chat: ChatDto): Promise<string> {
    return this.agent.call(chat.message);
  }
}
