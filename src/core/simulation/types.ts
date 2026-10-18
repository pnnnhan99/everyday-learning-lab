export interface SimulationContract<TInit = unknown, TResult = unknown> {
  initialize(): Promise<void> | void;
  run(input?: TInit): Promise<TResult> | TResult;
}

export interface SimulationMetadata {
  id: string;
  name: string;
  domain: 'mathematics' | 'chemistry' | 'physics' | 'biology' | 'realworld';
  description: string;
  assumptions: string[];
  limitations: string[];
  references: Array<{
    title: string;
    url: string;
  }>;
  units?: Record<string, string>;
  validInputRanges?: Record<string, { min: number; max: number }>;
  safetyNotes?: string[];
}

export interface Simulation<TInit = unknown, TResult = unknown> {
  id: string;
  metadata: SimulationMetadata;
  create: () => SimulationContract<TInit, TResult>;
}