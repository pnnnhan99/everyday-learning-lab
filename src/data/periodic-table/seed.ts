import type {
  DataQualifier,
  ElementBlock,
  ElementCategory,
  ElementState,
  LocalizedText,
  PeriodicElement,
  PeriodicReviewStatus,
  Quantity,
} from '@/types/periodic';

export interface PeriodicElementSeed {
  z: number;
  sym: string;
  en: string;
  vi: string;
  mass: number;
  massKind?: DataQualifier;
  group: number | null;
  period: number;
  block: ElementBlock;
  cat: ElementCategory;
  config: string;
  configNote?: LocalizedText;
  state: ElementState;
  stateKind?: DataQualifier;
  mp?: number | null;
  bp?: number | null;
  density?: number | null;
  mpKind?: DataQualifier;
  bpKind?: DataQualifier;
  densityKind?: DataQualifier;
  ox: number[];
  common?: number[];
  eneg?: number | null;
  enegKind?: DataQualifier;
  year?: number | null;
  by?: string | null;
  placeEn?: string | null;
  placeVi?: string | null;
  occurEn: string;
  occurVi: string;
  appsEn: string[];
  appsVi: string[];
  notes?: LocalizedText[];
  review?: PeriodicReviewStatus;
}

export const KELVIN = 'K';
export const ATOMIC_MASS_UNIT = 'u';
export const DENSITY_UNIT = 'g/cm³';
export const PAULING = 'Pauling';

export function quantity(
  value: number | null,
  unit: string,
  qualifier: DataQualifier = value === null ? 'unknown' : 'measured',
): Quantity {
  return { value, unit, qualifier };
}

export const HEAVY_PREDICTION_NOTE: LocalizedText = {
  en: 'No bulk sample has been produced. Physical values are predictions or unavailable; treat them as research data, not measured properties.',
  vi: 'Chưa từng tạo được mẫu khối lượng lớn. Các giá trị vật lý là dự đoán hoặc chưa có; hãy xem đây là dữ liệu nghiên cứu, không phải tính chất đã đo.',
};

export const NO_STABLE_ISOTOPE_NOTE: LocalizedText = {
  en: 'No stable isotopes exist. The listed atomic mass is the mass number of the longest-lived known isotope, not a standard atomic weight.',
  vi: 'Không có đồng vị ổn định. Khối lượng nguyên tử ghi ở đây là số khối của đồng vị sống lâu nhất đã biết, không phải nguyên tử khối tiêu chuẩn.',
};

export const ANCIENT_NOTE: LocalizedText = {
  en: 'Known and used since antiquity; no single modern discovery date is recorded.',
  vi: 'Được biết đến và sử dụng từ thời cổ đại; không có mốc phát hiện hiện đại duy nhất.',
};

export function buildPeriodicElement(seed: PeriodicElementSeed): PeriodicElement {
  const massQualifier = seed.massKind ?? 'measured';
  const notes: LocalizedText[] = [...(seed.notes ?? [])];
  if (massQualifier === 'isotope-dependent' && seed.z < 104) notes.push(NO_STABLE_ISOTOPE_NOTE);
  if (seed.z >= 104) notes.push(HEAVY_PREDICTION_NOTE);
  if (seed.year === null && seed.by === null) notes.push(ANCIENT_NOTE);

  const year = seed.year ?? null;
  const by = seed.by ?? null;
  const referenceIds = ['iupac', 'pubchem', 'rsc'];
  if (seed.z <= 92) referenceIds.push('ciaaw');
  if (seed.z >= 93) referenceIds.push('lanl');

  return {
    atomicNumber: seed.z,
    symbol: seed.sym,
    name: { en: seed.en, vi: seed.vi },
    atomicMass: quantity(seed.mass, ATOMIC_MASS_UNIT, massQualifier),
    group: seed.group,
    period: seed.period,
    block: seed.block,
    category: seed.cat,
    electronConfiguration: seed.config,
    ...(seed.configNote ? { electronConfigurationNote: seed.configNote } : {}),
    standardState: seed.state,
    standardStateQualifier: seed.stateKind ?? 'measured',
    physical: {
      meltingPointK: quantity(seed.mp ?? null, KELVIN, seed.mpKind),
      boilingPointK: quantity(seed.bp ?? null, KELVIN, seed.bpKind),
      densityGcm3: quantity(seed.density ?? null, DENSITY_UNIT, seed.densityKind),
    },
    chemical: {
      oxidationStates: seed.ox,
      commonOxidationStates: seed.common ?? seed.ox,
      electronegativity: quantity(
        seed.eneg ?? null,
        PAULING,
        seed.enegKind ?? (seed.eneg == null ? 'not-applicable' : 'measured'),
      ),
    },
    occurrence: { en: seed.occurEn, vi: seed.occurVi },
    applications: seed.appsEn.map((en, index) => ({ en, vi: seed.appsVi[index] ?? en })),
    discovery: {
      year,
      discoveredBy: by,
      place:
        seed.placeEn && seed.placeVi
          ? { en: seed.placeEn, vi: seed.placeVi }
          : null,
    },
    referenceIds,
    reviewStatus: seed.review ?? (seed.z >= 104 ? 'draft' : 'in-review'),
    dataNotes: notes,
  };
}
