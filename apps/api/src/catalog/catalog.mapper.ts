import type { Category, Product } from '@myshop/db';
import type {
  CategoryDetailDto,
  CategorySummaryDto,
  ProductDto,
  ProductSummaryDto,
} from '@myshop/shared';

type ProductWithCategory = Product & { category: Category };

export function toProductSummaryDto(
  product: ProductWithCategory,
): ProductSummaryDto {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    priceCents: product.priceCents,
    stock: product.stock,
    currency: product.currency,
    imageUrl: product.imageUrl,
    category: {
      name: product.category.name,
      slug: product.category.slug,
    },
  };
}

export function toProductDto(product: ProductWithCategory): ProductDto {
  return {
    ...toProductSummaryDto(product),
    description: product.description,
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    },
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export function toCategorySummaryDto(
  category: Category & { _count: { products: number } },
): CategorySummaryDto {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    productCount: category._count.products,
  };
}

export function toCategoryDetailDto(
  category: Category & { _count: { products: number } },
  products: ProductWithCategory[],
): CategoryDetailDto {
  return {
    ...toCategorySummaryDto(category),
    products: products.map(toProductSummaryDto),
  };
}
