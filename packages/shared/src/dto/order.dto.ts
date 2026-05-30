import type { Currency } from '../enums/currency.js';
import type { OrderStatus } from '../enums/order-status.js';

export interface OrderItemDto {
  id: string;
  productId: string;
  quantity: number;
  unitPriceCents: number;
}

export interface OrderDto {
  id: string;
  status: OrderStatus;
  totalCents: number;
  currency: Currency;
  items: OrderItemDto[];
  createdAt: string;
  updatedAt: string;
}
