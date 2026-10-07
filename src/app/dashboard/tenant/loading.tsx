export default function TenantLoading() {
  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="space-y-2">
        <div className="h-8 w-44 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded-lg bg-muted/70" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl bg-muted/40 p-4"
          />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-2xl bg-muted/30" />
    </div>
  );
}
