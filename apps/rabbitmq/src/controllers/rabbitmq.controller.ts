import { Controller, Get, Logger } from '@nestjs/common';
import { EventPattern, Ctx, RmqContext } from '@nestjs/microservices';
import type { Email } from '../domain/email.interface';
import { SendMailUsecase } from '../application/send-mail.usecase';

@Controller()
export class RabbitmqController {
  private readonly logger = new Logger(RabbitmqController.name)

  constructor(
    private readonly email: SendMailUsecase
  ) {}

  @EventPattern('send_email')
  async handleSendEmail(@Ctx() context: RmqContext): Promise<void> {
    const channel = context.getChannelRef()
    const message = context.getMessage()

    const { data } = JSON.parse(
      message.content.toString()
    )

    try {
      await this.email.send(data)
      channel.ack(message)
      this.logger.log('Email sent successfully')
    } catch (error) {
      this.logger.error('Failed to send email:', error)
      // Send to dead letter queue
      channel.nack(message, false, false)
    }
  }

  @EventPattern('dead_letter')
  async handleDeadLetter(@Ctx() context: RmqContext): Promise<void> {
    const channel = context.getChannelRef()
    const message = context.getMessage()

    const { data } = JSON.parse(
      message.content.toString()
    )

    channel.ack(message)

    // TODO: retry logic or logging
    console.log('Context of dead letter:', context)
    this.logger.error('Background process failed:', data)
  }
}
