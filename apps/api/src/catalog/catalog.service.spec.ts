import { NotFoundException } from '@nestjs/common';

const findManyCategoryMock = jest.fn<Promise<unknown[]>, [unknown]>();
const findUniqueCategoryMock = jest.fn<Promise<unknown>, [unknown]>();
const findManyProductMock = jest.fn<Promise<unknown[]>, [unknown]>();
const findUniqueProductMock = jest.fn<Promise<unknown>, [unknown]>();

jest.mock('@myshop/db', () => ({
  prisma: {
    category: {
      findMany: (args: unknown) => findManyCategoryMock(args),
      findUnique: (args: unknown) => findUniqueCategoryMock(args),
    },
    product: {
      findMany: (args: unknown) => findManyProductMock(args),
      findUnique: (args: unknown) => findUniqueProductMock(args),
    },
  },
}));

import { CatalogService } from './catalog.service';

describe('CatalogService', () => {
  let service: CatalogService;

  beforeEach(() => {
    service = new CatalogService();
    findManyCategoryMock.mockReset();
    findUniqueCategoryMock.mockReset();
    findManyProductMock.mockReset();
    findUniqueProductMock.mockReset();
  });

  it('lists categories with product counts', async () => {
    findManyCategoryMock.mockResolvedValueOnce([
      {
        id: 'cat-1',
        name: 'Tents',
        slug: 'tents',
        description: 'Shelters',
        sortOrder: 1,
        _count: { products: 2 },
      },
    ]);

    const result = await service.listCategories();

    expect(result).toEqual([
      {
        id: 'cat-1',
        name: 'Tents',
        slug: 'tents',
        description: 'Shelters',
        productCount: 2,
      },
    ]);
  });

  it('returns product detail by slug', async () => {
    findUniqueProductMock.mockResolvedValueOnce({
      id: 'prod-1',
      name: 'TrailNest Ultralight 2P Tent',
      slug: 'trailnest-ultralight-2p',
      description: 'Ultralight tent',
      priceCents: 24900,
      stock: 18,
      currency: 'USD',
      imageUrl: 'https://example.com/tent.jpg',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      category: {
        id: 'cat-1',
        name: 'Tents',
        slug: 'tents',
      },
    });

    const result = await service.getProductBySlug('trailnest-ultralight-2p');

    expect(result.slug).toBe('trailnest-ultralight-2p');
    expect(result.category.slug).toBe('tents');
    expect(result.priceCents).toBe(24900);
  });

  it('throws when product is missing', async () => {
    findUniqueProductMock.mockResolvedValueOnce(null);

    await expect(service.getProductBySlug('missing')).rejects.toThrow(
      NotFoundException,
    );
  });
});
