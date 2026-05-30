# SEO & Metadata Guidelines

> Dynamic metadata and international SEO for `@myshop/web`.

---

## Overview

Every dynamic product/blog page **must** export `generateMetadata`. Source: `.cursor/rules/nextjs-frontend.mdc`.

---

## Async `params` and `searchParams` (Next.js 15+)

Both are **Promises** — always await:

```typescript
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { ref } = await searchParams;
  // ...
}
```

**Forbidden**: synchronous `params.slug` access in pages, layouts, or route handlers.

---

## generateMetadata Template

```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: 'Product not found — My Shop' };

  return {
    title: `${product.name} | Official Store`,
    description: `${product.description.slice(0, 150)}...`,
    alternates: {
      canonical: `https://myshop.com/products/${slug}`,
      languages: {
        'en-US': `https://myshop.com/en/products/${slug}`,
        'zh-CN': `https://myshop.com/zh/products/${slug}`,
      },
    },
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.mainImage, width: 1200, height: 630, alt: product.name }],
      type: 'website',
    },
  };
}
```

---

## Performance (Core Web Vitals)

- **LCP**: `next/image` + `priority` on hero/product images
- **CLS**: explicit dimensions or `sizes` on all images
- **Fonts**: `next/font` — avoid FOUT

---

## Forbidden Patterns

- Static-only `<title>` on dynamic product routes
- Missing `canonical` / `alternates.languages` on localized pages
- Rendering locale-specific dates during SSR without client hydration guard
