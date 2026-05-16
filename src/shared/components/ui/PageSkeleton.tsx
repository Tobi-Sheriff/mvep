export function PageSkeleton() {
  return (
    <div role="status" aria-label="Loading…" className="animate-pulse">
      <div className="h-16 bg-slate-200 dark:bg-slate-700" />
      <div className="mx-auto max-w-7xl space-y-4 p-6">
        <div className="h-8 w-48 rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-slate-200 dark:bg-slate-700" />
          ))}
        </div>
      </div>
    </div>
  );
}
