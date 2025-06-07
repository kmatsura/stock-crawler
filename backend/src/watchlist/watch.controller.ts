import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { WatchService } from './watch.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users/:uid/watches')
@UseGuards(JwtAuthGuard)
export class WatchController {
  constructor(private readonly service: WatchService) {}

  @Get()
  findAll(@Param('uid') uid: string) {
    return this.service.findAll(uid);
  }

  @Post()
  create(@Param('uid') uid: string, @Body() body: { code: string }) {
    return this.service.create(uid, body.code);
  }

  @Delete()
  remove(@Param('uid') uid: string, @Body() body: { code: string }) {
    return this.service.remove(uid, body.code);
  }
}
