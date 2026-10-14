import { listElements } from '@/lib/db';
import { elementTypeIcon } from '@/components/lab/elementIcons';

export default async function ElementsPage() {
  const elements = await listElements();
  if (elements.length === 0) {
    return <div className="mx-auto max-w-6xl px-4 py-6"><p>No elements found.</p></div>;
  }
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {elements.map((el) => {
          const Icon = elementTypeIcon[el.type] ?? elementTypeIcon.chemical;
          return (
            <div key={el.id} className="rounded-2xl border p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800"><Icon size={20} /></span>
                <div><p className="font-semibold">{el.name}</p><p className="text-xs text-zinc-500">{el.id} · {el.type}</p></div>
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{el.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
