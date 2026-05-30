import type { ProductDto } from '@myshop/shared';

export function formatUsdPrice(priceCents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(priceCents / 100);
}

export function buildProductJsonLd(product: ProductDto, siteName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: [product.imageUrl],
    brand: {
      '@type': 'Brand',
      name: siteName,
    },
    offers: {
      '@type': 'Offer',
      price: (product.priceCents / 100).toFixed(2),
      priceCurrency: product.currency,
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `/products/${product.slug}`,
    },
  };
}
