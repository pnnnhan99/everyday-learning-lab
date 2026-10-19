import Link from 'next/link';

const domains = [
  { key: 'chemistry', label: 'Chemistry', href: '/learn/chem-acids-bases-101', lab3d: '/lab/3d?model=water', disabled: false, desc: 'Acids, bases, water molecule in 3D' },
  { key: 'mathematics', label: 'Mathematics', href: '/learn/math-fractions-101', lab3d: null, disabled: false, desc: 'Fractions fundamentals' },
  { key: 'physics', label: 'Physics', href: '/learn/phys-projectile-101', lab3d: '/lab/3d?model=projectile', disabled: false, desc: 'Projectile motion with parameters' },
  { key: 'biology', label: 'Biology & Earth', href: '/learn/bio-co2-o2-101', lab3d: '/lab/3d?model=plant-cell', disabled: false, desc: 'CO₂–O₂ balance and plant cell in 3D' },
  { key: 'realworld', label: 'Real-world Challenges', href: '/challenges', lab3d: null, disabled: false, desc: 'Interdisciplinary science tasks' },
];

export default function ExplorePage() {
  return (
    <div className="flex-1 p-6 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Explore</h1>
          <p className="text-white/70">Pick a domain to start learning with simulations.</p>
        </header>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {domains.map((domain) => (
            <div key={domain.key} className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm transition hover:border-white/20">
              <h2 className="text-lg font-semibold">{domain.label}</h2>
              <p className="mt-2 text-sm text-white/60">{domain.desc}</p>
              <div className="mt-4 flex items-center gap-3">
                {domain.disabled ? (
                  <span className="text-sm text-white/40">Coming soon</span>
                ) : (
                  <>
                    <Link href={domain.href} className="text-sm text-blue-400 hover:text-blue-300">
                      View lesson →
                    </Link>
                    <Link href="/lab" className="text-sm text-white/40 hover:text-white/60">
                      Lab
                    </Link>
                    {domain.lab3d && (
                      <Link href={domain.lab3d} className="text-sm text-sky-300 hover:text-sky-200">
                        3D
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
