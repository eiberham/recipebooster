import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AgentUseCase } from '../application/agent.usecase';
import { PromptDto } from './dto/prompt-dto';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Role } from '@/auth/domain/role.enum';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { Observable, from, map } from 'rxjs';

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly agent: AgentUseCase) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiBody({ type: PromptDto })
  @Sse('recipe-stream')
  async chat(@Body(ValidationPipe) prompt: PromptDto): Promise<Observable<MessageEvent>> {
    return from(this.agent.call(prompt.message)).pipe(
      map((chunk): MessageEvent => ({
        data: { text: chunk }
      }))
    );
  }
}
