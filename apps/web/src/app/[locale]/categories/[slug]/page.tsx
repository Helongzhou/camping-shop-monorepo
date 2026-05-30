import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ProductCard } from '@/components/product-card';
import { ProductJsonLd } from '@/components/product-json-ld';
import { Link } from '@/i18n/navigation';
import { getCategoryBySlug } from '@/lib/catalog';
import { buildCanonicalPath, buildLocaleAlternates } from '@/lib/metadata';

type CategoryDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: CategoryDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: 'Category not found' };
  }

  return {
    title: `${category.name} | TrailNest`,
    description: category.description,
    alternates: {
      canonical: buildCanonicalPath(locale, `/categories/${slug}`),
      languages: buildLocaleAlternates(`/categories/${slug}`),
    },
    openGraph: {
      title: category.name,
      description: category.description,
      type: 'website',
    },
  };
}

export default async function CategoryDetailPage({
  params,
}: CategoryDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [t, category] = await Promise.all([
    getTranslations('Catalog'),
    getCategoryBySlug(slug),
  ]);

  if (!category) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: category.products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `/products/${product.slug}`,
        name: product.name,
      })),
    },
  };

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
        <span className="text-zinc-900 dark:text-zinc-100">{category.name}</span>
      </nav>
      <header className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {category.name}
        </h1>
        <p className="mt-3 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          {category.description}
        </p>
      </header>
      {category.products.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">{t('emptyCategory')}</p>
      ) : (
        <section
          aria-label={t('productsInCategory', { name: category.name })}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {category.products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 3}
            />
          ))}
        </section>
      )}
    </main>
  );
}
