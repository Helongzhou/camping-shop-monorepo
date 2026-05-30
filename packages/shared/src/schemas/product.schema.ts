import { z } from 'zod';

import { Currency, CURRENCY_VALUES } from '../enums/currency.js';

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().min(1).max(5000),
  priceCents: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative(),
  currency: z.enum(CURRENCY_VALUES).default(Currency.USD),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
