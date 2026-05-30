import { z } from 'zod';

import { ORDER_STATUS_VALUES } from '../enums/order-status.js';
import { CURRENCY_VALUES } from '../enums/currency.js';

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPriceCents: z.number().int().nonnegative(),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  currency: z.enum(CURRENCY_VALUES),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUS_VALUES),
});

export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
