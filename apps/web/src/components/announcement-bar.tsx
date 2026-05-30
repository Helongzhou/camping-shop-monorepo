type AnnouncementBarProps = {
  announcement: string | null;
};

export function AnnouncementBar({ announcement }: AnnouncementBarProps) {
  if (!announcement) {
    return null;
  }

  return (
    <div
      className="bg-zinc-900 px-4 py-2 text-center text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
      role="status"
    >
      {announcement}
    </div>
  );
}
