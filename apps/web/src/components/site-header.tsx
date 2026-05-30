import type { SiteSettingsDto } from '@myshop/shared';

import { Link } from '@/i18n/navigation';

import { LocaleSwitcher } from './locale-switcher';
import { ThemeSwitcher } from './theme-switcher';

type SiteHeaderProps = {
  settings: SiteSettingsDto;
  categoriesLabel: string;
};

export function SiteHeader({ settings, categoriesLabel }: SiteHeaderProps) {
  return (
    <header className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            {settings.siteName}
          </Link>
          <nav aria-label="Main" className="hidden sm:block">
            <Link
              href="/categories"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              {categoriesLabel}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
