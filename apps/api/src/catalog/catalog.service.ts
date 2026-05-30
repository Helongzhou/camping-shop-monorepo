import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@myshop/db';
import type {
  CategoryDetailDto,
  CategorySummaryDto,
  ProductDto,
  ProductListQueryInput,
  ProductSummaryDto,
} from '@myshop/shared';

import {
  toCategoryDetailDto,
  toCategorySummaryDto,
  toProductDto,
  toProductSummaryDto,
} from './catalog.mapper';

@Injectable()
export class CatalogService {
  async listCategories(): Promise<CategorySummaryDto[]> {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { products: true } },
      },
    });

    return categories.map(toCategorySummaryDto);
  }

  async getCategoryBySlug(slug: string): Promise<CategoryDetailDto> {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: { select: { products: true } },
        products: {
          include: { category: true },
          orderBy: { name: 'asc' },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category not found: ${slug}`);
    }

    return toCategoryDetailDto(category, category.products);
  }

  async listProducts(
    query: ProductListQueryInput,
  ): Promise<ProductSummaryDto[]> {
    const products = await prisma.product.findMany({
      where: query.category
        ? { category: { slug: query.category } }
        : undefined,
      include: { category: true },
      orderBy: { name: 'asc' },
      take: query.limit,
      skip: query.offset,
    });

    return products.map(toProductSummaryDto);
  }

  async getProductBySlug(slug: string): Promise<ProductDto> {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException(`Product not found: ${slug}`);
    }

    return toProductDto(product);
  }
}
