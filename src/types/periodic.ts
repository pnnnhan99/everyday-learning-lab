import type { ScientificReference } from './game';

export type { ScientificReference };

/** Standard long-form categories used by the periodic table. */
export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide';

export const ELEMENT_CATEGORIES: readonly ElementCategory[] = [
  'alkali-metal',
  'alkaline-earth-metal',
  'transition-metal',
  'post-transition-metal',
  'metalloid',
  'nonmetal',
  'halogen',
  'noble-gas',
  'lanthanide',
  'actinide',
];

export type ElementBlock = 's' | 'p' | 'd' | 'f';
export type ElementState = 'solid' | 'liquid' | 'gas' | 'unknown';

/**
 * How much confidence a numeric value deserves. A missing value is always
 * accompanied by a qualifier other than `measured`.
 */
export type DataQualifier =
  | 'measured'
  | 'estimated'
  | 'isotope-dependent'
  | 'predicted'
  | 'unknown'
  | 'disputed'
  | 'not-applicable';

export type PeriodicReviewStatus = 'draft' | 'in-review' | 'expert-reviewed';

export interface LocalizedText {
  en: string;
  vi: string;
}

/**
 * A numeric value with its unit and provenance. `value` is `null` when no
 * reliable figure is available; the qualifier then records why.
 */
export interface Quantity {
  value: number | null;
  unit: string;
  qualifier: DataQualifier;
  note?: LocalizedText;
}

export interface DiscoveryInfo {
  year: number | null;
  /** Proper names are not translated. */
  discoveredBy: string | null;
  place: LocalizedText | null;
  note?: LocalizedText;
}

/**
 * A chemical element as represented on the periodic table. This is a different
 * concept from `Element` in `src/types/game.ts`, which models a lab substance.
 *
 * Layout convention: groups 1–18 are only assigned to the 18-column main table.
 * Lanthanides (Z 57–71) and actinides (Z 89–103) live in two separate f-block
 * rows. La and Ac keep group 3 so a group filter still finds a member of that
 * column; the remaining f-block elements have no group number.
 */
export interface PeriodicElement {
  atomicNumber: number;
  symbol: string;
  name: LocalizedText;
  atomicMass: Quantity;
  group: number | null;
  period: number;
  block: ElementBlock;
  category: ElementCategory;
  /** Ground-state configuration, noble-gas shorthand where possible. */
  electronConfiguration: string;
  electronConfigurationNote?: LocalizedText;
  /** State at 298.15 K and 100 kPa unless a note says otherwise. */
  standardState: ElementState;
  standardStateQualifier: DataQualifier;
  physical: {
    meltingPointK: Quantity;
    boilingPointK: Quantity;
    densityGcm3: Quantity;
  };
  chemical: {
    oxidationStates: number[];
    commonOxidationStates: number[];
    electronegativity: Quantity;
  };
  occurrence: LocalizedText;
  applications: LocalizedText[];
  discovery: DiscoveryInfo;
  /** Ids resolved against the periodic-table reference registry. */
  referenceIds: string[];
  reviewStatus: PeriodicReviewStatus;
  /** Explicit caveats such as predicted properties or disputed classifications. */
  dataNotes: LocalizedText[];
}

export interface PeriodicTableReference extends ScientificReference {
  id: string;
}

export type PeriodicValidationResult =
  | { ok: true }
  | { ok: false; errors: string[] };

const ELEMENT_STATES: readonly ElementState[] = ['solid', 'liquid', 'gas', 'unknown'];
const ELEMENT_BLOCKS: readonly ElementBlock[] = ['s', 'p', 'd', 'f'];
const DATA_QUALIFIERS: readonly DataQualifier[] = [
  'measured',
  'estimated',
  'isotope-dependent',
  'predicted',
  'unknown',
  'disputed',
  'not-applicable',
];
const REVIEW_STATUSES: readonly PeriodicReviewStatus[] = ['draft', 'in-review', 'expert-reviewed'];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

function validateLocalized(value: unknown, path: string, errors: string[]): value is LocalizedText {
  if (!isObject(value)) {
    errors.push(`${path} must be an object with en and vi strings`);
    return false;
  }
  if (!isNonEmptyString(value.en)) errors.push(`${path}.en is required`);
  if (!isNonEmptyString(value.vi)) errors.push(`${path}.vi is required`);
  return isNonEmptyString(value.en) && isNonEmptyString(value.vi);
}

function validateQuantity(value: unknown, path: string, errors: string[]): value is Quantity {
  if (!isObject(value)) {
    errors.push(`${path} must be a quantity object`);
    return false;
  }
  if (value.value !== null && (typeof value.value !== 'number' || !Number.isFinite(value.value))) {
    errors.push(`${path}.value must be a finite number or null`);
  }
  if (!isNonEmptyString(value.unit)) errors.push(`${path}.unit is required`);
  if (typeof value.qualifier !== 'string' || !(DATA_QUALIFIERS as string[]).includes(value.qualifier)) {
    errors.push(`${path}.qualifier must be one of ${DATA_QUALIFIERS.join(', ')}`);
  }
  if (value.value === null && value.qualifier === 'measured') {
    errors.push(`${path} has no value but is marked measured`);
  }
  if (value.value !== null && value.qualifier === 'unknown') {
    errors.push(`${path} has a value but is marked unknown`);
  }
  return true;
}

/** Validates one element record at the domain boundary. */
export function validatePeriodicElement(input: unknown): PeriodicValidationResult {
  const errors: string[] = [];
  if (!isObject(input)) return { ok: false, errors: ['Element must be an object'] };

  const v = input;
  if (typeof v.atomicNumber !== 'number' || !Number.isInteger(v.atomicNumber) || v.atomicNumber < 1 || v.atomicNumber > 118) {
    errors.push('atomicNumber must be an integer from 1 to 118');
  }
  if (typeof v.symbol !== 'string' || !/^[A-Z][a-z]?$/.test(v.symbol)) {
    errors.push('symbol must start with an uppercase letter and contain at most one lowercase letter');
  }
  validateLocalized(v.name, 'name', errors);

  validateQuantity(v.atomicMass, 'atomicMass', errors);
  if (isObject(v.atomicMass) && typeof v.atomicMass.value === 'number' && v.atomicMass.value <= 0) {
    errors.push('atomicMass.value must be positive');
  }

  if (v.group !== null && (typeof v.group !== 'number' || !Number.isInteger(v.group) || v.group < 1 || v.group > 18)) {
    errors.push('group must be an integer from 1 to 18, or null for f-block rows');
  }
  if (typeof v.period !== 'number' || !Number.isInteger(v.period) || v.period < 1 || v.period > 7) {
    errors.push('period must be an integer from 1 to 7');
  }
  if (typeof v.block !== 'string' || !(ELEMENT_BLOCKS as string[]).includes(v.block)) {
    errors.push('block must be s, p, d or f');
  }
  if (typeof v.category !== 'string' || !(ELEMENT_CATEGORIES as string[]).includes(v.category)) {
    errors.push('category is not a recognised periodic-table category');
  }
  if (typeof v.reviewStatus !== 'string' || !(REVIEW_STATUSES as string[]).includes(v.reviewStatus)) {
    errors.push('reviewStatus must be draft, in-review or expert-reviewed');
  }
  if (!isNonEmptyString(v.electronConfiguration)) errors.push('electronConfiguration is required');

  if (typeof v.standardState !== 'string' || !(ELEMENT_STATES as string[]).includes(v.standardState)) {
    errors.push('standardState must be solid, liquid, gas or unknown');
  }
  if (typeof v.standardStateQualifier !== 'string' || !(DATA_QUALIFIERS as string[]).includes(v.standardStateQualifier)) {
    errors.push('standardStateQualifier is not recognised');
  }

  if (!isObject(v.physical)) {
    errors.push('physical is required');
  } else {
    validateQuantity(v.physical.meltingPointK, 'physical.meltingPointK', errors);
    validateQuantity(v.physical.boilingPointK, 'physical.boilingPointK', errors);
    validateQuantity(v.physical.densityGcm3, 'physical.densityGcm3', errors);
  }

  if (!isObject(v.chemical)) {
    errors.push('chemical is required');
  } else {
    if (!Array.isArray(v.chemical.oxidationStates) || v.chemical.oxidationStates.length === 0) {
      errors.push('chemical.oxidationStates must be a non-empty array');
    }
    if (
      !Array.isArray(v.chemical.commonOxidationStates) ||
      v.chemical.commonOxidationStates.length === 0
    ) {
      errors.push('chemical.commonOxidationStates must be a non-empty array');
    }
    validateQuantity(v.chemical.electronegativity, 'chemical.electronegativity', errors);
  }

  validateLocalized(v.occurrence, 'occurrence', errors);
  if (!Array.isArray(v.applications) || v.applications.length === 0) {
    errors.push('applications must contain at least one localized entry');
  } else {
    v.applications.forEach((entry, index) => validateLocalized(entry, `applications[${index}]`, errors));
  }

  if (!isObject(v.discovery)) {
    errors.push('discovery is required');
  } else {
    if (v.discovery.year !== null && (typeof v.discovery.year !== 'number' || !Number.isInteger(v.discovery.year))) {
      errors.push('discovery.year must be an integer or null');
    }
    if (v.discovery.discoveredBy !== null && !isNonEmptyString(v.discovery.discoveredBy)) {
      errors.push('discovery.discoveredBy must be a non-empty string or null');
    }
    if (v.discovery.place !== null) validateLocalized(v.discovery.place, 'discovery.place', errors);
  }

  if (!Array.isArray(v.referenceIds) || v.referenceIds.length === 0 || v.referenceIds.some((id) => !isNonEmptyString(id))) {
    errors.push('referenceIds must be a non-empty array of ids');
  }
  if (!Array.isArray(v.dataNotes)) {
    errors.push('dataNotes must be an array');
  } else {
    v.dataNotes.forEach((note, index) => validateLocalized(note, `dataNotes[${index}]`, errors));
  }

  // Layout convention: only La and Ac carry a group number inside the f-block.
  const isFBlockCategory = v.category === 'lanthanide' || v.category === 'actinide';
  if (isFBlockCategory && typeof v.atomicNumber === 'number' && v.atomicNumber !== 57 && v.atomicNumber !== 89 && v.group !== null) {
    errors.push('Only La (57) and Ac (89) may carry a group number among f-block categories');
  }

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}

/**
 * Validates the complete table, including cross-record invariants that a
 * single-element check cannot see.
 */
export function validatePeriodicDataset(
  elements: readonly PeriodicElement[],
  references: readonly PeriodicTableReference[],
): PeriodicValidationResult {
  const errors: string[] = [];

  elements.forEach((element) => {
    const result = validatePeriodicElement(element);
    if (!result.ok) {
      result.errors.forEach((error) => errors.push(`Z=${element.atomicNumber}: ${error}`));
    }
  });

  if (elements.length !== 118) errors.push(`Expected 118 elements, received ${elements.length}`);

  const numbers = new Set(elements.map((element) => element.atomicNumber));
  if (numbers.size !== elements.length) errors.push('Atomic numbers must be unique');
  for (let z = 1; z <= 118; z += 1) {
    if (!numbers.has(z)) errors.push(`Missing atomic number ${z}`);
  }

  const symbols = new Set(elements.map((element) => element.symbol));
  if (symbols.size !== elements.length) errors.push('Element symbols must be unique');

  const referenceIds = new Set(references.map((reference) => reference.id));
  elements.forEach((element) => {
    element.referenceIds.forEach((id) => {
      if (!referenceIds.has(id)) errors.push(`Z=${element.atomicNumber} references unknown source "${id}"`);
    });
  });

  elements.forEach((element) => {
    const expectedPeriod =
      element.atomicNumber <= 2
        ? 1
        : element.atomicNumber <= 10
          ? 2
          : element.atomicNumber <= 18
            ? 3
            : element.atomicNumber <= 36
              ? 4
              : element.atomicNumber <= 54
                ? 5
                : element.atomicNumber <= 86
                  ? 6
                  : 7;
    if (element.period !== expectedPeriod) {
      errors.push(`Z=${element.atomicNumber} has period ${element.period}, expected ${expectedPeriod}`);
    }
  });

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}
