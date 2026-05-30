type SiteFooterProps = {
  footerText: string | null;
};

export function SiteFooter({ footerText }: SiteFooterProps) {
  if (!footerText) {
    return null;
  }

  return (
    <footer className="mt-auto border-t border-zinc-200 px-4 py-6 dark:border-zinc-800">
      <p className="mx-auto max-w-6xl text-center text-sm text-zinc-600 dark:text-zinc-400">
        {footerText}
      </p>
    </footer>
  );
}
