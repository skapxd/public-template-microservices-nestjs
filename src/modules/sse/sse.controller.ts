import { Controller, Get, Param, Post, Query, Req, Sse } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiOkResponse, ApiProduces, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';

import { CounterDto, NotificationsDto } from './sse.dto';
import { SseService } from './sse.service';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Get()
  render(@Query('id') id: string) {
    return this.sseService.render(id);
  }

  @Post()
  btn(@Query('counter') counter: number, @Query('id') id: string) {
    this.sseService.btn(counter, id);
  }

  @ApiOkResponse({ type: NotificationsDto, description: 'Notificaciones' })
  @Post('all')
  @Cron(CronExpression.EVERY_SECOND)
  cron() {
    this.sseService.cron();
  }

  @ApiProduces('text/stream')
  @ApiResponse({
    status: 200,
    type: CounterDto,
    description: 'Mensaje',
  })
  @ApiResponse({
    status: 201,
    type: NotificationsDto,
    description: 'Notificaciones',
  })
  @Sse(':id')
  sse(@Param('id') id: string, @Req() req: Request) {
    req.on('close', this.sseService.onCloseSse);

    return this.sseService.sse(id);
  }
}
