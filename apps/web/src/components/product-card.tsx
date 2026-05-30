import Image from 'next/image';
import type { ProductSummaryDto } from '@myshop/shared';

import { Link } from '@/i18n/navigation';
import { formatUsdPrice } from '@/lib/catalog-seo';

type ProductCardProps = {
  product: ProductSummaryDto;
  priority?: boolean;
};

export function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-900"
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={priority}
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {product.category.name}
        </p>
        <h2 className="text-base font-semibold leading-snug text-zinc-900 dark:text-zinc-50">
          <Link
            href={`/products/${product.slug}`}
            className="hover:underline"
          >
            {product.name}
          </Link>
        </h2>
        <p className="mt-auto text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {formatUsdPrice(product.priceCents)}
        </p>
      </div>
    </article>
  );
}
