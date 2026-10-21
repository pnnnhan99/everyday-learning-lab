import { SimulationContract } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnySimulationContract = SimulationContract<any, any>;

export const simulationRegistry = new Map<string, AnySimulationContract>();

export function registerSimulation(simulation: AnySimulationContract) {
  simulationRegistry.set(simulation.id, simulation);
}

export function getSimulation(id: string): AnySimulationContract | undefined {
  return simulationRegistry.get(id);
}
