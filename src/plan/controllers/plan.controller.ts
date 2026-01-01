import { Controller, Get, Post, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('plans')
export class PlanController {
  // Controller methods would go here
  constructor(){}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getPlans() {
    
  }

}