import type { PeriodicTableReference } from '@/types/periodic';

/**
 * Shared sources for the periodic-table dataset. Element records reference
 * these by id so a citation stays consistent across 118 entries.
 *
 * All sources are reputable, publicly accessible scientific references. Values
 * are conventional educational values; consult the primary literature before
 * using a figure for quantitative work.
 */
export const periodicTableReferences: readonly PeriodicTableReference[] = [
  {
    id: 'iupac',
    title: 'Periodic Table of the Elements',
    publisher: 'International Union of Pure and Applied Chemistry (IUPAC)',
    url: 'https://iupac.org/what-we-do/periodic-table-of-elements/',
  },
  {
    id: 'ciaaw',
    title: 'Atomic Weights of the Elements',
    publisher: 'Commission on Isotopic Abundances and Atomic Weights (CIAAW)',
    url: 'https://ciaaw.org/atomic-weights.htm',
  },
  {
    id: 'pubchem',
    title: 'Periodic Table of Elements',
    publisher: 'PubChem, U.S. National Library of Medicine',
    url: 'https://pubchem.ncbi.nlm.nih.gov/periodic-table/',
  },
  {
    id: 'rsc',
    title: 'Periodic Table',
    publisher: 'Royal Society of Chemistry',
    url: 'https://www.rsc.org/periodic-table',
  },
  {
    id: 'lanl',
    title: 'Periodic Table of the Elements',
    publisher: 'Los Alamos National Laboratory',
    url: 'https://periodic.lanl.gov/',
  },
  {
    id: 'nist',
    title: 'NIST Atomic Spectra Database',
    publisher: 'National Institute of Standards and Technology',
    url: 'https://physics.nist.gov/asd',
  },
];
