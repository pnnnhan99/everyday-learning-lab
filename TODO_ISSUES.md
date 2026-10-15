# TODO_ISSUES — MISSING FUNCTIONALITIES AUDIT (RESOLVED)
> Project: `everyday-science-sim` | Date: 2026-10-06 | Status: **DONE — `npm run build` passed**
> Routes: `/`, `/elements`, `/reactions`, `/admin`, `/profile`, `/api/elements`, `/api/elements/[id]`, `/api/reactions`, `/manifest.webmanifest`, `/sitemap.xml`

## 1. 🔴 DATA & API FETCHING — DONE (8/8)
- [x] Homepage Lab Dashboard (`app/page.tsx` + `LabBoard`)
- [x] `GET /api/elements` (`app/api/elements/route.ts`)
- [x] `GET /api/reactions` + `?e1=&e2=` (`app/api/reactions/route.ts`)
- [x] Async lookup + cache (`src/lib/reactionLookup.ts`)
- [x] API/service layer (`src/lib/fetcher.ts`, `src/services/*`)
- [x] loading/error/empty (`app/loading.tsx`, `app/error.tsx`, `app/not-found.tsx`)
- [x] Extended types + validation (`src/types/game.ts`)
- [x] Persistence + seed (`src/lib/repository.ts` interfaces, `src/lib/sqlite.ts`, `src/lib/sqliteRepository.ts`, `src/lib/migrate.ts`, `scripts/migrate.mjs`, `docs/persistence.md`)

## 2. 🟡 INTERACTIVE ACTIONS & CRUD — DONE (9/9)
- [x] Zustand lab store (`src/store/labStore.ts`)
- [x] DnD mixing (`ElementCard.tsx`, `Beaker.tsx`, `LabBoard.tsx`)
- [x] Reaction effects (`ReactionEffect.tsx`, framer-motion)
- [x] Lucide icons (`elementIcons.ts`)
- [x] CRUD (`AdminForms.tsx` + `POST/PUT/DELETE /api/*`)
- [x] Item actions (favorite, remove, reset + localStorage)
- [x] Search/filter/pagination (`DataTools.tsx`)
- [x] Client components (`"use client"` across lab/layout/admin)
- [x] Safety/history/undo (`history[]`, undo/clear, toxic guard)

## 3. 🔵 ROUTING & NAVIGATION — DONE (8/8)
- [x] AppShell/Sidebar/Header/Footer (`src/components/layout/*`)
- [x] Internal routes + `next/link` (`/`, `/elements`, `/reactions`, `/admin`, `/profile`)
- [x] Metadata VI + SEO (`app/layout.tsx`, `manifest.ts`, `sitemap.ts`)
- [x] Theme toggle (`ThemeToggle.tsx` + `uiStore`, persist)
- [x] VI/EN toggle (`LanguageToggle.tsx` + `src/i18n/dict.ts`)
- [x] Profile (`ProfileButton.tsx` + `app/profile/page.tsx`)
- [x] 404 + error boundary (`not-found.tsx`, `error.tsx`)
- [x] Responsive/mobile nav (drawer + collapsible sidebar, `uiStore`)


---

## 1. 🔴 DATA & API FETCHING (Du lieu & API)

- [ ] **Homepage la template mac dinh, chua co UI Sim** | File: `app/page.tsx:3-69` | Hien trang: chi render logo Next.js + text `edit page.tsx` + 2 nut ngoai `Deploy Now/Documentation`. Khong import elements/reactions. | Action: Viet lai `app/page.tsx` thanh Lab Dashboard, them loading/error/empty states.
- [ ] **Data Elements hardcode 100%** | File: `src/data/mockReactions.ts:3-32` | Hien trang: `export const elements` hardcode 4 items (lemon, baking-soda, bleach, vinegar), icon = emoji. Khong goi API. | Action: Tao `GET /api/elements`, thay bang fetch/SWR, giu mock lam fallback/test.
- [ ] **Data Reactions hardcode 100%** | File: `src/data/mockReactions.ts:34-67` | Hien trang: `export const reactions` hardcode 4 cap (lemon+baking-soda=clean, bleach+vinegar=toxic...). | Action: Tao `GET /api/reactions`, chuan hoa theo `EffectType`.
- [ ] **Logic findReaction chay local-memory** | File: `src/data/mockReactions.ts:69-75` | Hien trang: `.find()` tren mang local, khong async/API/cache. | Action: Chuyen thanh async goi `GET /api/reactions?e1=&e2=` hoac Zustand async action.
- [ ] **Khong ton tai lop API/backend** | File: `app/api/**`, `src/lib/api.ts`, `src/services/**` (thieu) | Hien trang: search `fetch(|axios|useSWR|/api/` = 0 hit / 28 files. | Action: Tao `src/lib/fetcher.ts`, `src/services/*`, `app/api/elements/route.ts`, `app/api/reactions/route.ts`.
- [ ] **Thieu loading/error/empty/skeleton** | File: `app/page.tsx` (thieu `loading.tsx`, `error.tsx`) | Hien trang: khong Suspense/skeleton/toast. | Action: Them `app/loading.tsx`, `app/error.tsx`, skeleton cards.
- [ ] **Types chua du cho API that** | File: `src/types/game.ts:1-19` | Hien trang: chi co id/name/icon/description/type; thieu id DB, pH, safetyLevel, imageUrl, timestamps. | Action: Mo rong types + zod validate, thay emoji bang lucide icons.
- [x] **Co DB/persistence/seed** | `src/lib/repository.ts` + `src/lib/sqliteRepository.ts` + `src/lib/migrate.ts` — SQLite voi UNIQUE constraints, migrations/seeds, no credentials committed. |
## 2. 🟡 INTERACTIVE ACTIONS & CRUD (Tuong tac & Logic)

- [ ] **Chua co store — zustand cai roi nhung bo khong** | File: (thieu `src/store/*`), `package.json:19` co zustand 5.0.15 nhung 0 import | Hien trang: search `useState` = 0 hit. | Action: Tao `src/store/labStore.ts`: elements, selected[2], result, history, favorites.
- [ ] **Core Action keo-tha tron hoa chat chua co** | File: (thieu `Beaker.tsx`, `ElementCard.tsx`) | Hien trang: `@dnd-kit/core` + utilities da cai nhung 0 import, khong `DndContext/onDragEnd`. | Action: Dung Lab UI voi DndContext, onDragEnd goi findReaction/API.
- [ ] **Hieu ung no/doc/sach chua co** | File: (thieu `ReactionEffect.tsx`) | Hien trang: `framer-motion` da cai nhung 0 import, `effectType` chi la string. | Action: Them animation shake/particles + mau theo effectType + canh bao toxic.
- [ ] **Icons he thong chua dung, dang dung emoji** | File: `src/data/mockReactions.ts:7,15,21,27` | Hien trang: `lucide-react` da cai nhung 0 import. | Action: Thay emoji bang FlaskConical/TestTube, map ElementType -> icon.
- [ ] **CRUD Elements/Reactions chua co** | File: (thieu `ElementForm.tsx`, `app/lab/admin/*`) | Hien trang: khong nut Them/Sua/Xoa, khong POST/PUT/DELETE. | Action: Them admin CRUD + API POST/PUT/DELETE + confirm delete.
- [ ] **Row/Item Actions chua co** | File: (thieu) | Hien trang: khong onClick/onSubmit handler ngoai template. | Action: Them favorite, remove from beaker, view detail, reset lab + persist localStorage.
- [ ] **Search/Filter/Pagination chua co** | File: (thieu `SearchBar.tsx`, `FilterTabs.tsx`) | Hien trang: khong query params (?q=&type=&page=). | Action: Them search + filter acid|base|food|chemical + pagination, sync URL params.
- [ ] **Chua co Client Component nao** | File: toan repo | Hien trang: search `"use client"` = 0 hit. | Action: Them `"use client"` cho LabBoard, Beaker, StoreProvider.
- [ ] **Thieu validation/safety/history/undo** | File: (thieu) | Hien trang: tron bleach+vinegar=toxic chi hien text, khong canh bao/luu lich su. | Action: Them modal canh bao toxic + history[] + undo/clear.

## 3. 🔵 ROUTING & NAVIGATION (Dieu huong & Global Settings)

- [ ] **Thieu Layout chinh (Sidebar + Header + Footer)** | File: `app/layout.tsx:20-29` | Hien trang: chi `<html><body>{children}</body></html>`, khong Sidebar/Header. Search Sidebar|Header chi hit ten RootLayout. | Action: Tao `AppShell.tsx`, `Sidebar.tsx`, `Header.tsx`, gan vao RootLayout.
- [ ] **Chua co dieu huong noi bo, chi link ngoai** | File: `app/page.tsx:26,33,44,59` | Hien trang: 4x `<a href="https://vercel.com...|https://nextjs.org...">`, 0 next/link, 0 route /lab, /elements. | Action: Them routes + dung `<Link>`, active state qua usePathname().
- [ ] **Metadata/SEO/i18n mac dinh** | File: `app/layout.tsx:15-18`, lang="en" | Hien trang: title `Create Next App`, chua doi sang Everyday Science Sim. | Action: Update metadata + lang="vi" + manifest + sitemap.
- [ ] **Theme toggle chua co logic** | File: (thieu `ThemeToggle.tsx`) | Hien trang: chi co class dark:, khong toggle/persist. | Action: Them ThemeProvider + toggle, persist localStorage.
- [ ] **Doi ngon ngu VI/EN chua co** | File: (thieu next-intl) | Hien trang: data/UI tieng Anh, khong switcher. | Action: Them next-intl + toggle trong Header.
- [ ] **Profile/Auth/Settings chua co** | File: (thieu `LoginButton.tsx`, `app/profile/*`) | Hien trang: khong avatar/menu/session. | Action: Them auth (NextAuth/Clerk) hoac mock profile + progress per-user.
- [ ] **Thieu 404 + error boundary** | File: (thieu `app/not-found.tsx`, `app/error.tsx`) | Hien trang: route sai hien 404 mac dinh. | Action: Them not-found.tsx + error.tsx voi link ve /.
- [ ] **Thieu responsive/mobile nav** | File: (thieu) | Hien trang: khong hamburger/drawer cho Sidebar. | Action: Them mobile drawer + collapsible Sidebar.

---

### Uu tien (PM)
1. P0: Viet lai `app/page.tsx` + AppShell/Sidebar/Header + labStore (zustand) + mock -> `app/api/*`.
2. P1: DnD Beaker (@dnd-kit) + framer-motion effects + lucide icons + search/filter.
3. P2: CRUD admin + pagination + history/undo + theme/i18n + 404/error + SEO.
