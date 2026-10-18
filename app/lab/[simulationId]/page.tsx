import { registerAllSimulations } from '@/simulations';

registerAllSimulations();

export default function LabSimulationPage() {
  return (
    <div className="flex-1 p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-semibold">Lab Simulation</h1>
        <p className="mt-2 text-white/70">Simulation contract and registry ready. Next: wire a simple interactive runner.</p>
      </div>
    </div>
  );
}
