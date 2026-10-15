import { SimulationContract } from './types';

export const simulationRegistry = new Map<string, SimulationContract<any, any>>();

export function registerSimulation(simulation: SimulationContract<any, any>) {
  simulationRegistry.set(simulation.id, simulation);
}

export function getSimulation(id: string): SimulationContract<any, any> | undefined {
  return simulationRegistry.get(id);
}