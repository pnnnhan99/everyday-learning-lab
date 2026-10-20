export interface SimulationContract<S, R> {
  id: string;
  title: string;
  description: string;
  // Initialize the simulation with settings
  initialize(settings?: S): Promise<void>;
  // Run the simulation and get results
  run(): Promise<R>;
  // Reset the simulation to initial state
  reset(): void;
}
