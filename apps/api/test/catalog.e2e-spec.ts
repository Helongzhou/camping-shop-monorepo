import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { Currency, type ProductDto } from '@myshop/shared';

import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import type { StandardResponse } from '../src/common/interfaces/standard-response.interface';
import { CatalogService } from '../src/catalog/catalog.service';

describe('Catalog (e2e)', () => {
  let app: INestApplication<App>;

  const listCategoriesMock = jest.fn<
    ReturnType<CatalogService['listCategories']>,
    Parameters<CatalogService['listCategories']>
  >();

  const getProductBySlugMock = jest.fn<
    Promise<ProductDto>,
    Parameters<CatalogService['getProductBySlug']>
  >();

  const catalogServiceMock: Pick<
    CatalogService,
    'listCategories' | 'getProductBySlug'
  > = {
    listCategories: listCategoriesMock,
    getProductBySlug: getProductBySlugMock,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CatalogService)
      .useValue(catalogServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  it('GET /categories returns category list', async () => {
    listCategoriesMock.mockResolvedValue([
      {
        id: 'cat-1',
        name: 'Tents',
        slug: 'tents',
        description: 'Shelters',
        productCount: 2,
      },
    ]);

    const response = await request(app.getHttpServer())
      .get('/categories')
      .expect(200);

    const body = response.body as StandardResponse<
      Array<{ slug: string; name: string }>
    >;

    expect(body.success).toBe(true);
    expect(body.data[0]?.slug).toBe('tents');
  });

  it('GET /products/:slug returns product detail', async () => {
    getProductBySlugMock.mockResolvedValue({
      id: 'prod-1',
      name: 'TrailNest Ultralight 2P Tent',
      slug: 'trailnest-ultralight-2p',
      description: 'Ultralight tent for two.',
      priceCents: 24900,
      stock: 18,
      currency: Currency.USD,
      imageUrl: 'https://example.com/tent.jpg',
      category: {
        id: 'cat-1',
        name: 'Tents',
        slug: 'tents',
      },
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z',
    });

    const response = await request(app.getHttpServer())
      .get('/products/trailnest-ultralight-2p')
      .expect(200);

    const body = response.body as StandardResponse<ProductDto>;

    expect(body.data.slug).toBe('trailnest-ultralight-2p');
    expect(body.data.priceCents).toBe(24900);
  });
});
