# Periodic Table — Reference Website Analysis

Research goal: identify useful interaction, learning, content, and data-quality patterns for Everyday Learning Lab's periodic-table experience. These websites are references, not templates to copy. Re-check current features and terms before implementing integrations or reusing assets.

## 1. Reference shortlist

| Website | Primary strength | Patterns worth learning | What not to assume |
| --- | --- | --- | --- |
| [Ptable](https://ptable.com/) | Dense interactive reference | Switchable property views, electron configurations, orbitals, isotopes, compounds, temperature/state exploration, broad localization | A large scientific reference surface is not automatically beginner-friendly. Do not reproduce its interface or data wholesale. |
| [Royal Society of Chemistry Periodic Table](https://periodic-table.rsc.org/) | Context and storytelling | Element profiles, visual artwork, history, alchemy, podcasts/videos, trends and supply-risk context | Media and editorial assets may have separate copyright/licensing. Link to them rather than copying. |
| [PubChem Periodic Table](https://pubchem.ncbi.nlm.nih.gov/ptable/) | Structured element reference and provenance | Table/list/game views, element profile pages, property-source attribution, machine-readable data | PubChem may aggregate multiple upstream sources; preserve provenance and field meaning/units. |
| [NIST Periodic Table](https://www.nist.gov/pml/periodic-table-elements) | Critically evaluated atomic properties | Scientific reference baseline and downloadable reference material | It is not a complete school-learning experience or a source for every editorial field. |
| [IUPAC Periodic Table](https://iupac.org/what-we-do/periodic-table-of-elements/) | Official nomenclature and conventions | Official names/symbols, atomic-weight conventions, group numbering, notes on unsettled conventions | Some classifications and group-3 choices require explicit notes. |
| [CIAAW](https://ciaaw.org/atomic-weights.htm) | Standard atomic weights and isotope abundance | Explain standard atomic weights, intervals, isotope dependence, and revisions | Do not convert an isotope mass number into a standard atomic weight without labeling it. |
| [WebElements](https://www.webelements.com/) | Detailed element reference | Broad per-element property coverage and structured organization | Depth can overwhelm younger learners; advanced properties belong behind progressive disclosure. |
| [Theodore Gray's Periodic Table](https://periodictable.com/) | Visual connection to physical samples | Real-world element samples and visual curiosity | Specimen photography needs licensing/provenance and may not represent every allotrope or pure sample safely. |
| [Periodic Table of Videos](https://www.periodicvideos.com/) | Video-led discovery | Short human explanations, demonstrations, element-specific stories | Demonstrations are not instructions for unsupervised experiments. Review safety and link to the original source. |
| [PhET Chemistry Simulations](https://phet.colorado.edu/en/simulations/category/chemistry) | Guided interactive learning | Learn-by-changing-variables, explanatory feedback, focused simulation scope | Do not force every periodic-table property into a simulation. |

## 2. Patterns to adopt

### A. A fast reference first

- Preserve the recognizable long-form 18-column periodic table.
- Keep symbol and atomic number visually prominent.
- Make search forgiving: localized names, symbols, and atomic numbers.
- Let category/group/period filters combine with search.
- Make selected-element details available without losing table context.
- Keep mobile behavior explicit; horizontal scrolling is preferable to silently rearranging scientific positions.

### B. Progressive disclosure

Use a small, stable summary on each cell and reveal deeper data after selection.

1. At a glance: name, symbol, atomic number, family/category.
2. School-level detail: group, period, block, electron configuration, state, common uses, simple explanation.
3. Scientific detail: atomic weight/isotope notes, oxidation states, electronegativity, melting/boiling points, density, source and uncertainty.
4. Learning activities: trends, comparisons, quizzes, and simulations as separate experiences.

### C. Explain why a property matters

A property table is more useful when learners can answer:
- What does this property mean?
- How is it measured or defined?
- What pattern appears across a period or down a group?
- What is a familiar real-world example?
- Where does the value come from, and how certain is it?

### D. Connect each element to context

RSC and video-led references demonstrate the value of history, discovery, uses, and visual explanation. Start with short reviewed editorial summaries and source links. Do not copy artwork, photos, scripts, podcasts, or descriptions.

### E. Separate reference data from learning mechanics

PubChem's multiple views and educational game are useful patterns. Keep the scientific dataset independent from quiz/progress state so the same source data can support later learning activities.

## 3. Recommended product positioning

Everyday Learning Lab should not try to outcompete specialist reference websites on the number of scientific properties. Its advantage should be:

**A clear bilingual periodic table that helps learners understand patterns and connect an element's properties to everyday materials, lessons, and safe experiments.**

Differentiation:
- Vietnamese and English experience from the start.
- Beginner-friendly explanations with optional deeper scientific data.
- Direct links to Chemistry lessons and the existing Chemistry Lab.
- Short self-checks and learning activities after the reference MVP is stable.
- Transparent citations, uncertainty labels, and content review status.

## 4. Data-source hierarchy

Use sources according to the type of claim rather than treating one website as universally authoritative.

| Data / claim | Preferred source direction |
| --- | --- |
| Element recognition, names, symbols, atomic numbers, group conventions | IUPAC |
| Standard atomic weights and isotope abundances | CIAAW / IUPAC; consult NIST where appropriate |
| Atomic spectra, energy levels, electron configurations and ionization data | NIST Atomic Spectra Database and relevant evaluated references |
| Broad element properties and source-linked element pages | PubChem, checking upstream citations for each field |
| Physical and chemical property cross-checks | NIST, WebElements, primary/evaluated literature as appropriate |
| Educational interpretation and classroom framing | RSC Education and reputable education sources; editorial review is still required |
| Demonstration videos and visual inspiration | Original publisher only; link and provide context/safety caveats |

Useful source entry points:
- [IUPAC periodic table](https://iupac.org/what-we-do/periodic-table-of-elements/)
- [IUPAC IPTEI education resource](https://iupac.org/iptei/)
- [CIAAW standard atomic weights](https://ciaaw.org/atomic-weights.htm)
- [NIST periodic table](https://www.nist.gov/pml/periodic-table-elements)
- [NIST Atomic Spectra Database](https://physics.nist.gov/asd)
- [PubChem periodic table](https://pubchem.ncbi.nlm.nih.gov/ptable/)
- [PubChem element data documentation](https://pubchem.ncbi.nlm.nih.gov/docs/periodic-table-element-pages)

## 5. Product gaps suggested by the research

These are opportunities, not automatic MVP requirements:

| Opportunity | Learning value | Priority |
| --- | --- | --- |
| Property trend view with explanation | Helps learners see periodic patterns instead of memorizing isolated values | High, post-MVP |
| Compare two or more elements | Makes similarities and differences explicit | High, post-MVP |
| Element quiz and recall practice | Supports retrieval practice | High, post-MVP |
| Everyday use/material connections | Bridges abstract chemistry and daily life | High, staged |
| Isotope explorer | Introduces isotope abundance and nuclear stability carefully | Medium |
| Temperature/state explorer | Makes phase changes and element states more intuitive | Medium |
| 2D/3D atom visualization | Helps visualize shells/orbitals while clearly explaining model limits | Medium; only after scientific-model review |
| Video/podcast integration | Adds human context | Medium; external links first |
| Supply risk/environmental context | Connects chemistry to society and sustainability | Later; requires dated sources and nuanced framing |

## 6. Copyright, safety, and scientific integrity

- Do not scrape or copy site text, photos, illustrations, videos, quizzes, or branding.
- Do not embed or redistribute third-party assets unless license and usage terms permit it.
- Prefer original explanations and visual assets; cite factual sources and link to original media.
- A visual model is not proof of quantitative scientific accuracy.
- Do not present a classroom demonstration as a safe home experiment.
- Any activity involving chemicals needs age-appropriate safety review, explicit supervision requirements, and a safe alternative. The periodic table itself should remain a reference experience, not a chemical-handling guide.
- Keep data values, units, qualifiers, references, and editorial explanations distinct.
- Preserve current review statuses and quantity qualifiers. Never silently replace unknown/predicted/disputed values with plausible-looking numbers.

## 7. Research conclusion

Prioritize a reliable reference experience, then add learning layers that make the table more understandable: trend exploration, comparison, recall practice, and contextual lessons. Avoid building a clone of Ptable or RSC, adding a general chemistry solver, or creating a heavy 3D atom experience before the learning objective and scientific limitations are defined.
