export default function PublicLoading() {
  return (
    <div className="container mx-auto min-h-[50vh] px-4 py-12">
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-96 animate-pulse rounded-lg bg-muted/60" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-2xl bg-muted/40"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
