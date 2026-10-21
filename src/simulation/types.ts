export type SimulationInput = object;

export type SimulationOutput = object;

export interface SimulationMetadata {
  id: string;
  name: string;
  description: string;
  // Scientific references, assumptions, safety notes, etc.
  references: string[];
  assumptions: string[];
  safetyNotes: string;
  // Units, valid input ranges, limitations, etc.
  inputRanges: Record<string, { min: number; max: number; unit: string }>;
  outputUnits: Record<string, string>;
}

export interface SimulationContract<I extends SimulationInput, O extends SimulationOutput> {
  id: string;
  metadata: SimulationMetadata;
  validateInput: (input: unknown) => input is I;
  simulate: (input: I) => Promise<O>;
}
