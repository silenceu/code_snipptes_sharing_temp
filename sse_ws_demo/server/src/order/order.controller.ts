import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { PlaceOrderDto } from '../common/dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('new')
  async PlaceOrder(@Body() placeOrderDto: PlaceOrderDto) {
    return await this.orderService.PlaceOrder(placeOrderDto);
  }
}
