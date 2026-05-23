function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-slate-200 bg-white shadow-card">
      <div className="flex gap-3 p-4">
        <div className="h-14 w-14 shrink-0 animate-pulse rounded-full bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
      <div className="px-4 pb-4">
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
      </div>
      <div className="mx-4 grid grid-cols-3 gap-1 overflow-hidden rounded-lg">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="aspect-square animate-pulse bg-slate-200" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 p-4">
        <div className="h-10 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-10 animate-pulse rounded-lg bg-slate-200" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f5f8fc]">
      <div className="border-b border-white/10 bg-azul-noite">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="mb-4 space-y-2">
            <div className="h-3 w-36 animate-pulse rounded bg-white/20" />
            <div className="h-8 w-full max-w-xl animate-pulse rounded bg-white/20" />
          </div>
          <div className="h-14 w-full max-w-3xl animate-pulse rounded-xl bg-white/20" />
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8 lg:py-8">
        <div className="h-96 animate-pulse rounded-card border border-slate-200 bg-white shadow-card" />
        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-5 w-52 animate-pulse rounded bg-slate-200" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-slate-200 sm:w-48" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
