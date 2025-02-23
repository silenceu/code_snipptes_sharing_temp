import { ApiProperty } from '@nestjs/swagger';

export class OrderItem {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  qty: number;
}

export class PlaceOrderDto {
  @ApiProperty()
  tableId: string;
  @ApiProperty({ type: [OrderItem] })
  items: OrderItem[];
}

export class AddItemsDto {
  @ApiProperty()
  id: string;
  @ApiProperty({ type: [OrderItem] })
  items: OrderItem[];
}

export class SubscribeOrderDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  customerId: string;
}

export interface MessageEvent {
  data: string | object;
  id?: string;
  type?: string;
  retry?: number;
}
