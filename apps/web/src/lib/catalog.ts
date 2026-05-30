import { Currency, type CategorySummaryDto, type ProductDto, type ProductSummaryDto } from '@myshop/shared';

interface CatalogListResponse<T> {
  success: true;
  data: T;
}

const FALLBACK_CATEGORIES: CategorySummaryDto[] = [
  {
    id: 'fallback-tents',
    name: 'Tents',
    slug: 'tents',
    description: 'Ultralight and weather-ready shelters for every season on the trail.',
    productCount: 2,
  },
  {
    id: 'fallback-sleeping-bags',
    name: 'Sleeping Bags',
    slug: 'sleeping-bags',
    description: 'Warm, packable sleep systems rated for alpine nights and summer camps.',
    productCount: 2,
  },
  {
    id: 'fallback-backpacks',
    name: 'Backpacks',
    slug: 'backpacks',
    description: 'Trail-tested packs with ergonomic support for day hikes and thru-hikes.',
    productCount: 2,
  },
  {
    id: 'fallback-camp-kitchen',
    name: 'Camp Kitchen',
    slug: 'camp-kitchen',
    description: 'Stoves, cookware, and essentials to fuel your backcountry meals.',
    productCount: 2,
  },
];

const FALLBACK_PRODUCTS: ProductSummaryDto[] = [
  {
    id: 'fallback-tent',
    name: 'TrailNest Ultralight 2P Tent',
    slug: 'trailnest-ultralight-2p',
    priceCents: 24900,
    stock: 18,
    currency: Currency.USD,
    imageUrl:
      'https://images.unsplash.com/photo-1478131143081-80f7f84b01e7?auto=format&fit=crop&w=1200&q=80',
    category: { name: 'Tents', slug: 'tents' },
  },
  {
    id: 'fallback-bag',
    name: 'Aurora 15°F Down Sleeping Bag',
    slug: 'aurora-15-down-bag',
    priceCents: 18900,
    stock: 25,
    currency: Currency.USD,
    imageUrl:
      'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=1200&q=80',
    category: { name: 'Sleeping Bags', slug: 'sleeping-bags' },
  },
  {
    id: 'fallback-pack',
    name: 'Ridge Explorer 45L Backpack',
    slug: 'ridge-explorer-45l',
    priceCents: 15900,
    stock: 22,
    currency: Currency.USD,
    imageUrl:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
    category: { name: 'Backpacks', slug: 'backpacks' },
  },
  {
    id: 'fallback-stove',
    name: 'Ember Canister Stove Kit',
    slug: 'ember-canister-stove',
    priceCents: 7900,
    stock: 40,
    currency: Currency.USD,
    imageUrl:
      'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=1200&q=80',
    category: { name: 'Camp Kitchen', slug: 'camp-kitchen' },
  },
];

function isCatalogResponse<T>(value: unknown): value is CatalogListResponse<T> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return record.success === true && Array.isArray(record.data);
}

function isProductResponse(value: unknown): value is CatalogListResponse<ProductDto> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  if (record.success !== true || typeof record.data !== 'object' || record.data === null) {
    return false;
  }

  const data = record.data as Record<string, unknown>;
  return typeof data.slug === 'string' && typeof data.description === 'string';
}

async function fetchCatalog<T>(
  path: string,
  fallback: T,
  validator: (value: unknown) => value is CatalogListResponse<T>,
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    return fallback;
  }

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return fallback;
    }

    const body: unknown = await response.json();

    if (!validator(body)) {
      return fallback;
    }

    return body.data;
  } catch {
    return fallback;
  }
}

export async function getCategories(): Promise<CategorySummaryDto[]> {
  return fetchCatalog<CategorySummaryDto[]>(
    '/categories',
    FALLBACK_CATEGORIES,
    isCatalogResponse,
  );
}

export async function getCategoryBySlug(
  slug: string,
): Promise<(CategorySummaryDto & { products: ProductSummaryDto[] }) | null> {
  const fallbackCategory = FALLBACK_CATEGORIES.find(
    (category) => category.slug === slug,
  );

  const fallback =
    fallbackCategory === undefined
      ? null
      : {
          ...fallbackCategory,
          products: FALLBACK_PRODUCTS.filter(
            (product) => product.category.slug === fallbackCategory.slug,
          ),
        };

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    return fallback;
  }

  try {
    const response = await fetch(`${baseUrl}/categories/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return fallback;
    }

    const body: unknown = await response.json();
    if (
      typeof body !== 'object' ||
      body === null ||
      (body as { success?: boolean }).success !== true
    ) {
      return fallback;
    }

    return (
      body as {
        data: CategorySummaryDto & { products: ProductSummaryDto[] };
      }
    ).data;
  } catch {
    return fallback;
  }
}

export async function getProducts(options?: {
  category?: string;
  limit?: number;
}): Promise<ProductSummaryDto[]> {
  const params = new URLSearchParams();
  if (options?.category) {
    params.set('category', options.category);
  }
  if (options?.limit) {
    params.set('limit', String(options.limit));
  }

  const query = params.toString();
  const path = query ? `/products?${query}` : '/products';

  let fallback = FALLBACK_PRODUCTS;
  if (options?.category) {
    fallback = FALLBACK_PRODUCTS.filter(
      (product) => product.category.slug === options.category,
    );
  }
  if (options?.limit) {
    fallback = fallback.slice(0, options.limit);
  }

  return fetchCatalog<ProductSummaryDto[]>(path, fallback, isCatalogResponse);
}

export async function getProductBySlug(slug: string): Promise<ProductDto | null> {
  const fallbackProduct = FALLBACK_PRODUCTS.find(
    (product) => product.slug === slug,
  );

  const fallback: ProductDto | null = fallbackProduct
    ? {
        ...fallbackProduct,
        description:
          'Trail-tested gear from TrailNest. Built for comfort, durability, and fast miles on the trail.',
        category: {
          id: `fallback-${fallbackProduct.category.slug}`,
          name: fallbackProduct.category.name,
          slug: fallbackProduct.category.slug,
        },
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      }
    : null;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    return fallback;
  }

  try {
    const response = await fetch(`${baseUrl}/products/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return fallback;
    }

    const body: unknown = await response.json();
    if (!isProductResponse(body)) {
      return fallback;
    }

    return body.data;
  } catch {
    return fallback;
  }
}
