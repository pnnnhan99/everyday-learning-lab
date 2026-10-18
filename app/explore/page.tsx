import Link from 'next/link';

const domains = [
  { key: 'chemistry', label: 'Chemistry', href: '/learn/chem-acids-bases-101' },
  { key: 'mathematics', label: 'Mathematics', href: '/learn/math-fractions-101' },
  { key: 'physics', label: 'Physics', href: '/learn/physics-coming-soon', disabled: true },
  { key: 'biology', label: 'Biology & Earth', href: '/learn/biology-coming-soon', disabled: true },
  { key: 'realworld', label: 'Real-world Challenges', href: '/learn/realworld-coming-soon', disabled: true },
];

export default function ExplorePage() {
  return (
    <div className="flex-1 p-6 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Explore Everyday Learning Lab</h1>
          <p className="text-white/70">Discover lessons, simulations, and challenges across five learning domains.</p>
        </header>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {domains.map((domain) => (
            <div key={domain.key} className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm">
              <h2 className="text-lg font-semibold">{domain.label}</h2>
              <p className="mt-2 text-sm text-white/60">
                {domain.disabled ? 'Content coming soon.' : 'Published and ready to explore.'}
              </p>
              <div className="mt-4">
                {domain.disabled ? (
                  <span className="text-sm text-white/40">Coming soon</span>
                ) : (
                  <Link href={domain.href} className="text-sm text-blue-400 hover:text-blue-300">
                    Go to lessons →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
