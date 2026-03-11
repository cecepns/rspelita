function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-700/60 ${className}`}
    />
  )
}

export function TextSkeleton({ lines = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className="h-3 w-full" />
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  )
}

export default Skeleton

