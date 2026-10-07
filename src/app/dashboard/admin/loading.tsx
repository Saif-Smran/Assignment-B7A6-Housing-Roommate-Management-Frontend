export default function AdminLoading() {
  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="space-y-2">
        <div className="h-8 w-52 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-80 animate-pulse rounded-lg bg-muted/70" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl bg-muted/40 p-4"
          />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-2xl bg-muted/30" />
    </div>
  );
}
