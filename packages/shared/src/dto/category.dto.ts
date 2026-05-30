import type { Currency } from '../enums/currency.js';

export interface ProductSummaryDto {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  stock: number;
  currency: Currency;
  imageUrl: string;
  category: {
    name: string;
    slug: string;
  };
}

export interface CategorySummaryDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
}

export interface CategoryDetailDto extends CategorySummaryDto {
  products: ProductSummaryDto[];
}
