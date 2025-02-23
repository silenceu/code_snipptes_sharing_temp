import { Body, Controller, Post } from '@nestjs/common';
import { AddItemsDto } from '../common/dto';
import { WsService } from './ws.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ws')
@Controller('ws')
export class WsController {
  constructor(private readonly wsService: WsService) {}
  @Post('add_items')
  async AddItems(@Body() addItemsDto: AddItemsDto) {
    return await this.wsService.AddItems(addItemsDto);
  }
}
