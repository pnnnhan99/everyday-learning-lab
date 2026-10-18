import { acidBaseCO2Simulation } from '../domains/chemistry/simulations/acidBaseCO2';
import { projectileSimulation } from '../domains/physics/simulations/projectile';
import { co2o2Simulation } from '../domains/biology/simulations/co2-o2';
import { globalRegistry } from '../core/simulation/registry';

export function registerAllSimulations() {
  globalRegistry.register(acidBaseCO2Simulation);
  globalRegistry.register(projectileSimulation);
  globalRegistry.register(co2o2Simulation);
}

export { globalRegistry, SimulationRegistry } from '../core/simulation/registry';
export type { Simulation, SimulationContract, SimulationMetadata } from '../core/simulation/types';
export { acidBaseCO2Simulation, projectileSimulation, co2o2Simulation };
