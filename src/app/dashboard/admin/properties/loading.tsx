import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPropertiesLoading() {
  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 pb-10 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
        <Skeleton className="mb-6 h-6 w-40" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border">
              <tr>
                {Array.from({ length: 5 }, (_, index) => (
                  <th
                    key={`property-loading-header-${index + 1}`}
                    className="px-3 py-3"
                  >
                    <Skeleton className="h-3 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }, (_, index) => (
                <tr
                  key={`property-loading-row-${index + 1}`}
                  className="border-b border-border/60 last:border-0"
                >
                  <td className="space-y-2 px-3 py-4">
                    <Skeleton className="h-4 w-52" />
                    <Skeleton className="h-3 w-24" />
                  </td>
                  <td className="px-3 py-4">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td className="px-3 py-4">
                    <Skeleton className="h-4 w-28" />
                  </td>
                  <td className="px-3 py-4">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="px-3 py-4">
                    <Skeleton className="ml-auto h-8 w-20 rounded-lg" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
