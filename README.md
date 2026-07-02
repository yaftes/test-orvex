# Orvex Prompt Studio — UI Mock

A complete, high-fidelity UI mock of Orvex Prompt Studio: all 24 pages from
[mock.md](./mock.md), fully interactive, running on mock data.

**Stack:** Vite + React 18 + Tailwind CSS v4 + `react-router-dom` + `lucide-react`.
**Brand:** `#8000FF` on white/black.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5173. Start at the landing page (`/`), sign in with
anything (it's a mock), or jump straight to the app at `/app`.

## Page map

| Route | Page |
|---|---|
| `/` | Marketing landing (logged out) |
| `/signin` · `/signup` · `/choose-org` | Auth flow |
| `/app` | Home dashboard |
| `/app/marketplace` | Marketplace (search, filters, infinite scroll — state lives in the URL) |
| `/app/skills/:id` | Skill detail (Overview + Versions, comments, reviews, suggest-an-edit) |
| `/app/skills/:id/use` | Use it (prompt + assistant deep links) |
| `/app/skills/:id/export` | Export (Claude / ChatGPT / plain shapes) |
| `/app/builder/:id` | Builder (blocks, autosave status, preview, publish) — use `new` for a blank one |
| `/app/drafts` · `/app/drafts/:id` | Drafts + draft manage |
| `/app/published` · `/app/published/:id/v/:version` | Published + frozen version snapshot (deprecate/undeprecate) |
| `/app/review` | Review inbox (before/after suggestions, accept/decline, apply) |
| `/app/memory/onboarding` · `/app/memory` | Memory onboarding + portrait/editor |
| `/app/librarian` | The Librarian (in-tray, shelves, sealed items, connections) |
| `/app/wiki` · `/app/activity` · `/app/following` · `/app/collections` | Personal + social |
| `/app/authors/:handle` | Public author profile (try `mayachen`) |
| `/s/:id` · `/c/:shareId` | Public share pages (skill / collection — try `/c/daily-drivers-x7k2`) |
| `/app/settings` · `/app/admin` | Settings + admin panel |

## Light & dark themes

Both themes ship. Toggle with the **sun/moon button** in the app topbar (or the
landing header), or from **Settings → Appearance**. The choice persists in
`localStorage` and the first visit follows your OS preference.

**How it works (worth knowing before you copy code):** the theme is class-based
(`.dark` on `<html>`) and implemented almost entirely in `src/index.css` by
remapping CSS variables — the neutral scale flips, `surface`/`canvas` swap, and
the pastel accent tints (emerald/rose/amber/sky/brand) get dark equivalents.
Components carry **no `dark:` variants**, so they stay clean and portable.
Two conventions keep it working:

- `bg-surface` / `bg-canvas` are the semantic surfaces (never `bg-white`).
- Always-dark panels (landing hero, ink cards) use the **`zinc`** scale, which
  is deliberately not remapped — they render identically in both themes.

## The floating flask button (bottom-right)

A demo-only switcher that previews each page's honest states:
**Live / Loading / Empty / Error.** Every data page implements all three states
per the brief. Delete `src/components/DemoStateSwitcher.jsx` for production.

## Copying pieces into the real project

The mock is deliberately structured for lifting:

- **`src/components/ui.jsx`** — the whole design system (Button, Badge, Card,
  Modal, Tabs, EmptyState, …) in one dependency-free file. Copy it first;
  everything else builds on it.
- **`src/components/skills.jsx`** — SkillCard, signal rows, block renderers.
- **`src/pages/*.jsx`** — each page is self-contained; it imports only the UI
  kit, `lib/utils`, and mock data.
- **`src/data/mock.js`** — the *only* place data comes from. To wire a page to
  your backend, replace its imports from `data/mock` with your API calls; the
  components consume plain shapes (documented by example in that file).
- **`src/index.css`** — the design tokens (brand scale for `#8000FF`, shadows,
  animations, and the entire dark theme). If your project doesn't use Tailwind v4 yet:
  `npm i tailwindcss @tailwindcss/vite`, add the plugin to `vite.config.js`,
  and import this CSS. It coexists fine with existing styles.

Fonts are Inter (body) + Space Grotesk (display), loaded in `index.html`.
# orvex-prompt-studio-mock
