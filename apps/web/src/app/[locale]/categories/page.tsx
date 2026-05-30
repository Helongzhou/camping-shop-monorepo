import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { CategoryCard } from '@/components/category-card';
import { getCategories } from '@/lib/catalog';
import { buildCanonicalPath, buildLocaleAlternates } from '@/lib/metadata';

type CategoriesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: CategoriesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Catalog.meta.categories' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: buildCanonicalPath(locale, '/categories'),
      languages: buildLocaleAlternates('/categories'),
    },
  };
}

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, categories] = await Promise.all([
    getTranslations('Catalog'),
    getCategories(),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
      <header className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t('categoriesTitle')}
        </h1>
        <p className="mt-3 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          {t('categoriesSubtitle')}
        </p>
      </header>
      <section
        aria-label={t('categoriesTitle')}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2"
      >
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            productCountLabel={t('productCount', {
              count: category.productCount,
            })}
          />
        ))}
      </section>
    </main>
  );
}
