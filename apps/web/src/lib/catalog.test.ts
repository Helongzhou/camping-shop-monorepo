import assert from 'node:assert/strict';
import { describe, it, beforeEach, afterEach } from 'node:test';

import { Currency } from '@myshop/shared';

import { getCategories, getProductBySlug } from './catalog';
import { buildProductJsonLd, formatUsdPrice } from './catalog-seo';

describe('catalog fallbacks', () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_API_URL;
  });

  afterEach(() => {
    if (originalApiUrl === undefined) {
      delete process.env.NEXT_PUBLIC_API_URL;
    } else {
      process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
    }
  });

  it('returns fallback categories when API URL is unset', async () => {
    const categories = await getCategories();

    assert.ok(categories.length >= 4);
    assert.equal(categories[0]?.slug, 'tents');
  });

  it('returns fallback product detail by slug', async () => {
    const product = await getProductBySlug('trailnest-ultralight-2p');

    assert.ok(product);
    assert.equal(product?.slug, 'trailnest-ultralight-2p');
    assert.equal(product?.currency, Currency.USD);
  });
});

describe('catalog-seo helpers', () => {
  it('formats USD prices from cents', () => {
    assert.equal(formatUsdPrice(24900), '$249.00');
  });

  it('builds Product JSON-LD with availability', () => {
    const jsonLd = buildProductJsonLd(
      {
        id: 'prod-1',
        name: 'TrailNest Ultralight 2P Tent',
        slug: 'trailnest-ultralight-2p',
        description: 'Ultralight tent',
        priceCents: 24900,
        stock: 5,
        currency: Currency.USD,
        imageUrl: 'https://example.com/tent.jpg',
        category: {
          id: 'cat-1',
          name: 'Tents',
          slug: 'tents',
        },
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      'TrailNest',
    );

    assert.equal(jsonLd['@type'], 'Product');
    assert.equal(jsonLd.offers.price, '249.00');
    assert.equal(
      jsonLd.offers.availability,
      'https://schema.org/InStock',
    );
  });
});
