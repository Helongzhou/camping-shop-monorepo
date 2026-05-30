import type { CategorySummaryDto } from '@myshop/shared';

import { Link } from '@/i18n/navigation';

type CategoryCardProps = {
  category: CategorySummaryDto;
  productCountLabel: string;
};

export function CategoryCard({
  category,
  productCountLabel,
}: CategoryCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        <Link
          href={`/categories/${category.slug}`}
          className="hover:underline"
        >
          {category.name}
        </Link>
      </h2>
      <p className="flex-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {category.description}
      </p>
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {productCountLabel}
      </p>
    </article>
  );
}
