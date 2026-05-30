import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import {
  productListQuerySchema,
  slugParamSchema,
  type CategoryDetailDto,
  type CategorySummaryDto,
  type ProductDto,
  type ProductSummaryDto,
} from '@myshop/shared';

import type { StandardResponse } from '../common/interfaces/standard-response.interface';
import { CatalogService } from './catalog.service';

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('categories')
  async listCategories(): Promise<StandardResponse<CategorySummaryDto[]>> {
    const data = await this.catalogService.listCategories();
    return { success: true, data };
  }

  @Get('categories/:slug')
  async getCategory(
    @Param('slug') slug: string,
  ): Promise<StandardResponse<CategoryDetailDto>> {
    const parsed = slugParamSchema.safeParse(slug);
    if (!parsed.success) {
      throw new NotFoundException(`Category not found: ${slug}`);
    }

    const data = await this.catalogService.getCategoryBySlug(parsed.data);
    return { success: true, data };
  }

  @Get('products')
  async listProducts(
    @Query('category') category?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<StandardResponse<ProductSummaryDto[]>> {
    const query = productListQuerySchema.parse({
      category,
      limit,
      offset,
    });
    const data = await this.catalogService.listProducts(query);
    return { success: true, data };
  }

  @Get('products/:slug')
  async getProduct(
    @Param('slug') slug: string,
  ): Promise<StandardResponse<ProductDto>> {
    const parsed = slugParamSchema.safeParse(slug);
    if (!parsed.success) {
      throw new NotFoundException(`Product not found: ${slug}`);
    }

    const data = await this.catalogService.getProductBySlug(parsed.data);
    return { success: true, data };
  }
}
