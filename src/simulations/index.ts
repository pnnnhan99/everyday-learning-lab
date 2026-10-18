import { acidBaseCO2Simulation } from '../domains/chemistry/simulations/acidBaseCO2';
import { globalRegistry } from '../core/simulation/registry';

export function registerAllSimulations() {
  globalRegistry.register(acidBaseCO2Simulation);
}

export { globalRegistry, SimulationRegistry } from '../core/simulation/registry';
export type { Simulation, SimulationContract, SimulationMetadata } from '../core/simulation/types';
export { acidBaseCO2Simulation };
