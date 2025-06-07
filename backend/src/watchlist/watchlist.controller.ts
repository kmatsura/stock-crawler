import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';

@Controller('users/:uid/watches')
export class WatchlistController {
  constructor(private readonly service: WatchlistService) {}

  @Get()
  async findAll(@Param('uid') uid: string) {
    return this.service.findAll(uid);
  }

  @Post()
  async create(@Param('uid') uid: string, @Body() body: { code: string }) {
    return this.service.create(uid, body.code);
  }

  @Delete(':code')
  async remove(@Param('uid') uid: string, @Param('code') code: string) {
    await this.service.remove(uid, code);
    return { ok: true };
  }
}
