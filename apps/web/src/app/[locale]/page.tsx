import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

import { CategoryCard } from '@/components/category-card';
import { ProductCard } from '@/components/product-card';
import { Link } from '@/i18n/navigation';
import { getCategories, getProducts } from '@/lib/catalog';
import { buildCanonicalPath, buildLocaleAlternates } from '@/lib/metadata';

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage.meta' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: buildCanonicalPath(locale, '/'),
      languages: buildLocaleAlternates('/'),
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, catalogT, categories, featuredProducts] = await Promise.all([
    getTranslations('HomePage'),
    getTranslations('Catalog'),
    getCategories(),
    getProducts({ limit: 4 }),
  ]);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-4 py-16 sm:px-6 lg:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
              {t('title')}
            </h1>
            <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              {t('subtitle')}
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/categories"
              className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              {t('ctaPrimary')}
            </Link>
            <Link
              href="/categories"
              className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
        <section aria-labelledby="featured-categories-heading" className="mb-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2
                id="featured-categories-heading"
                className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50"
              >
                {catalogT('featuredCategories')}
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                {catalogT('featuredCategoriesSubtitle')}
              </p>
            </div>
            <Link
              href="/categories"
              className="hidden text-sm font-medium text-zinc-900 underline-offset-4 hover:underline sm:inline dark:text-zinc-100"
            >
              {catalogT('viewAllCategories')}
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {categories.slice(0, 4).map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                productCountLabel={catalogT('productCount', {
                  count: category.productCount,
                })}
              />
            ))}
          </div>
        </section>

        <section aria-labelledby="featured-products-heading">
          <div className="mb-8">
            <h2
              id="featured-products-heading"
              className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50"
            >
              {catalogT('featuredProducts')}
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              {catalogT('featuredProductsSubtitle')}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index < 2}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
