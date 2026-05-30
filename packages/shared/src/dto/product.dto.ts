import type { Currency } from '../enums/currency.js';

export interface ProductDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  stock: number;
  currency: Currency;
  imageUrl: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
}
