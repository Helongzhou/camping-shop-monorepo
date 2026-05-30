import { z } from 'zod';

export const slugParamSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const createCategorySchema = z.object({
  name: z.string().min(1).max(200),
  slug: slugParamSchema,
  description: z.string().min(1).max(2000),
  sortOrder: z.number().int().nonnegative().default(0),
});

export const updateCategorySchema = createCategorySchema.partial();

export const productListQuerySchema = z.object({
  category: slugParamSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type ProductListQueryInput = z.infer<typeof productListQuerySchema>;
