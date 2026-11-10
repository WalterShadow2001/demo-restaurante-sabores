export default function MenuLoading() {
  return (
    <section className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full">
          <div className="skeleton-shimmer mb-2 h-6 w-24 rounded-full" />
          <div className="skeleton-shimmer h-10 w-48 rounded-md" />
          <div className="skeleton-shimmer mt-3 h-4 w-full max-w-xl rounded" />
        </div>
        <div className="skeleton-shimmer h-9 w-36 rounded-md" />
      </div>

      {/* Tabs skeleton */}
      <div className="mb-6 flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="skeleton-shimmer h-9 rounded-full"
            style={{ width: `${80 + i * 20}px` }}
          />
        ))}
      </div>

      {/* Dish cards skeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-border/60">
            <div className="skeleton-shimmer aspect-[4/3] w-full" />
            <div className="space-y-2 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="skeleton-shimmer h-4 w-2/3 rounded" />
                <div className="skeleton-shimmer h-4 w-12 rounded" />
              </div>
              <div className="skeleton-shimmer h-3 w-full rounded" />
              <div className="skeleton-shimmer h-3 w-5/6 rounded" />
              <div className="flex gap-2 pt-2">
                <div className="skeleton-shimmer h-8 flex-1 rounded-md" />
                <div className="skeleton-shimmer h-8 w-24 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
