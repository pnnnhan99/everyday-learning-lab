export default function Loading() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-6 sm:grid-cols-3">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="animate-pulse rounded-2xl border p-4">
          <div className="h-4 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-2 h-8 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-2 h-3 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}
