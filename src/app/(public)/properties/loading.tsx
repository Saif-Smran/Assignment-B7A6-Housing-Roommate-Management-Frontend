export default function PropertiesLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-8 w-64 animate-pulse rounded-xl bg-muted" />
        <div className="h-4 w-96 animate-pulse rounded-lg bg-muted/60" />
      </div>

      {/* Filter bar skeleton */}
      <div className="mt-8 h-20 animate-pulse rounded-2xl border border-border/40 bg-muted/30" />

      {/* Grid skeleton */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-3xl border border-border/50 bg-card p-4 shadow-sm"
          >
            <div className="h-52 w-full animate-pulse rounded-2xl bg-muted" />
            <div className="mt-4 space-y-2">
              <div className="h-5 w-3/4 animate-pulse rounded-lg bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded-lg bg-muted/70" />
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
              <div className="h-6 w-24 animate-pulse rounded-lg bg-muted" />
              <div className="h-9 w-28 animate-pulse rounded-xl bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
