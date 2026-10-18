import type { Simulation, SimulationContract } from './types';

export class SimulationRegistry {
  private simulations = new Map<string, Simulation<unknown, unknown>>();

  register<TInit = unknown, TResult = unknown>(simulation: Simulation<TInit, TResult>): void {
    this.simulations.set(simulation.id, simulation as Simulation<unknown, unknown>);
  }

  get<TInit = unknown, TResult = unknown>(id: string): Simulation<TInit, TResult> | undefined {
    return this.simulations.get(id) as Simulation<TInit, TResult> | undefined;
  }

  list(): Simulation<unknown, unknown>[] {
    return Array.from(this.simulations.values());
  }

  create<TInit = unknown, TResult = unknown>(id: string): SimulationContract<TInit, TResult> | undefined {
    return this.get<TInit, TResult>(id)?.create();
  }

  has(id: string): boolean {
    return this.simulations.has(id);
  }
}

export const globalRegistry = new SimulationRegistry();
