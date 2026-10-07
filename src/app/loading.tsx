export default function RootLoading() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        <p className="animate-pulse text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Loading UrbanMatch...
        </p>
      </div>
    </div>
  );
}
