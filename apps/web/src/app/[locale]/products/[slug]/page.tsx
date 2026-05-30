import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Locale } from '@myshop/shared';

import { ProductJsonLd } from '@/components/product-json-ld';
import { Link } from '@/i18n/navigation';
import { getProductBySlug } from '@/lib/catalog';
import { buildProductJsonLd, formatUsdPrice } from '@/lib/catalog-seo';
import { buildCanonicalPath, buildLocaleAlternates } from '@/lib/metadata';
import { getSiteSettings } from '@/lib/settings';
import { STATIC_PRODUCT_SLUGS } from '@/lib/static-catalog-slugs';
import { routing } from '@/i18n/routing';

type ProductDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    STATIC_PRODUCT_SLUGS.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Product not found' };
  }

  const description =
    product.description.length > 150
      ? `${product.description.slice(0, 150)}…`
      : product.description;

  return {
    title: `${product.name} | TrailNest`,
    description,
    alternates: {
      canonical: buildCanonicalPath(locale, `/products/${slug}`),
      languages: buildLocaleAlternates(`/products/${slug}`),
    },
    openGraph: {
      title: product.name,
      description,
      images: [
        {
          url: product.imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: 'website',
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [t, product, settings] = await Promise.all([
    getTranslations('Catalog'),
    getProductBySlug(slug),
    getSiteSettings(locale as Locale),
  ]);

  if (!product) {
    notFound();
  }

  const jsonLd = buildProductJsonLd(product, settings.siteName);
  const inStock = product.stock > 0;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
      <ProductJsonLd data={jsonLd} />
      <nav aria-label={t('breadcrumb')} className="mb-6 text-sm text-zinc-500">
        <Link href="/categories" className="hover:underline">
          {t('categoriesTitle')}
        </Link>
        <span aria-hidden="true" className="mx-2">
          /
        </span>
        <Link
          href={`/categories/${product.category.slug}`}
          className="hover:underline"
        >
          {product.category.name}
        </Link>
        <span aria-hidden="true" className="mx-2">
          /
        </span>
        <span className="text-zinc-900 dark:text-zinc-100">{product.name}</span>
      </nav>
      <article className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <section aria-label={t('productImage')}>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </section>
        <section className="flex flex-col gap-6">
          <header>
            <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {product.category.name}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {product.name}
            </h1>
          </header>
          <p className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            {formatUsdPrice(product.priceCents)}
          </p>
          <p
            className={
              inStock
                ? 'text-sm font-medium text-emerald-600 dark:text-emerald-400'
                : 'text-sm font-medium text-red-600 dark:text-red-400'
            }
          >
            {inStock ? t('inStock') : t('outOfStock')}
          </p>
          <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400">
            {product.description}
          </p>
          <Link
            href={`/categories/${product.category.slug}`}
            className="inline-flex w-fit items-center text-sm font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
          >
            {t('viewCategory', { name: product.category.name })}
          </Link>
        </section>
      </article>
    </main>
  );
}
