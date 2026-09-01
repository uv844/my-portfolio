# Yuvraj Singh — Portfolio

Dark technical portfolio built around cursor-reactive interaction, scroll-staged reveals and
server-rendered live data. Next.js 16 App Router, TypeScript, Tailwind CSS v4, Framer Motion.

Live data (LeetCode stats, GitHub contributions and recent pushes) is fetched in React Server
Components and cached, so the numbers on the page refresh themselves without a redeploy and
without a client-side loading state.

---

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build && npm start   # production build
```

No environment variables and no API keys — every upstream used is public.

---

## Architecture

### One pointer loop, zero re-renders per frame

Four cursor effects run at once (custom cursor, background spotlight + reactive grid, 3D card
tilt, particle constellation). Implemented naively — each with its own `mousemove` listener
setting React state — that would be dozens of re-renders per frame.

Instead, [`lib/pointer.ts`](lib/pointer.ts) owns **one** document-level `pointermove`
listener and **one** `requestAnimationFrame` loop. It lerps toward the pointer and writes CSS
custom properties on `document.documentElement`:

| Property | Meaning |
| --- | --- |
| `--mx` / `--my` | pointer position, lightly smoothed (cursor dot) |
| `--sx` / `--sy` | heavily smoothed (spotlight, cursor ring — gives the trailing feel) |
| `--mxp` / `--myp` | the same as viewport percentages |
| `--pdown` | 1 while the pointer is down |

Every effect then consumes those variables **in CSS only**. React never renders during pointer
movement. The loop parks itself after the pointer settles and on `visibilitychange`.

Card-local effects use [`components/fx/useCardPointer.ts`](components/fx/useCardPointer.ts),
which attaches its `pointermove` listener on `pointerenter` and removes it on `pointerleave` —
only one card is hovered at a time, so the page never carries more than one of these.

The pointer effects deliberately use **no** animation library — a library that re-renders or
schedules per frame would defeat the whole design. `Magnetic`, `Counter`, `Scramble`, `Panel`
and the cursor are all hand-written against these CSS variables.

### Two motion systems, each where it earns its bytes

Scroll motion is split deliberately rather than run through one mechanism.

**CSS reveals — for content that just needs to arrive.** [`Reveal`](components/fx/Reveal.tsx) is
a **server** component. It only emits `data-reveal="…"` and a `--d` delay. A single page-wide
IntersectionObserver in [`RevealRoot`](components/fx/RevealRoot.tsx) flips `data-visible` and
unobserves; the animation itself is a CSS transition. Wrapping dozens of elements in reveals
adds one observer, not dozens, and costs no per-element JS. Used for standalone paragraphs,
section dividers and one-off rows.

**Framer Motion — for sequenced motion CSS cannot express.** Anything where elements must
arrive *in relation to each other*, or where motion is driven by scroll position rather than by
crossing a threshold:

| Primitive | What it does |
| --- | --- |
| [`Stair`](components/motion/Stair.tsx) / `StairStep` | staircase reveals — the parent owns `staggerChildren`, children own the visual state, so N elements read as one gesture |
| [`StairText`](components/motion/StairText.tsx) | section headings climb in word by word out of an overflow mask |
| [`Parallax`](components/motion/Parallax.tsx) | `useScroll` → `useTransform` drift, the one effect CSS genuinely cannot do (scroll-driven animations are still Chromium-only) |
| [`ScrollRail`](components/motion/ScrollRail.tsx) | nav progress rail, `useScroll` → `useSpring` → `scaleX` |
| [`Pressable`](components/motion/Pressable.tsx) | spring press feedback (1.03 hover / 0.97 press) so a fast tap-and-release stays interruptible |

Scroll and parallax values are MotionValues written straight to the element, bypassing React
re-render entirely — the same principle as the pointer loop.

All nine sections stay **server** components. Only the motion wrappers are client components,
so they sit as leaves in the tree rather than forcing whole sections into the client bundle.

Three deliberate constraints in [`components/motion/MotionRoot.tsx`](components/motion/MotionRoot.tsx)
and [`lib/motion.ts`](lib/motion.ts):

- **`LazyMotion features={domAnimation} strict`** — loads the DOM animation bundle (variants,
  `whileInView`, hover/tap/focus) and excludes layout projection and drag, which are the bulk
  of the library. `strict` makes a stray `motion.*` import throw at runtime instead of silently
  self-bundling every feature and undoing the saving, so every component uses `m.*`.
- **`MotionConfig reducedMotion="user"`** — one setting strips every transform animation
  app-wide for reduced-motion users while opacity still crossfades. Verified: 0 of 88 animated
  elements retain a transform under `prefers-reduced-motion: reduce`.
- **One vocabulary in `lib/motion.ts`** — every spring, stagger step and viewport threshold is
  a named token (`springIn`, `STEP.card`, `VIEWPORT`). Nothing tunes its own timing inline, so
  the whole page shares one sense of weight.


### Live data is fetched on the server

[`lib/data.ts`](lib/data.ts) holds three fetchers, each with `next: { revalidate }` and a
static fallback:

| Source | Endpoint | Cache |
| --- | --- | --- |
| LeetCode | `POST leetcode.com/graphql` | 1 h |
| Contributions | `github-contributions-api.jogruber.de/v4/uv844` | 1 h |
| GitHub repos + events | `api.github.com/users/uv844/…` | 30 min |

Server-side is not incidental: LeetCode's endpoint requires a `Referer` header and rejects
browser origins, so this cannot be done from the client at all. If an upstream fails the
fetcher returns `live: false` and the UI renders a `cached` tag rather than a fake live badge.

Live GitHub metadata (language, stars, last push) is merged **over** the hand-written project
entries by repo name — the prose always wins, only the volatile fields come from the API.

Recent events are rolled up per repository. GitHub emits one event per push, so a burst of
commits to one repo would otherwise render as six identical rows.

### Content is data

[`content/profile.ts`](content/profile.ts) and [`content/projects.ts`](content/projects.ts)
hold every factual claim on the site. Change a fact there, not in a component.

**On the two problem counts:** LeetCode's API reports ~156 solved for this account; the CV
quotes 580+ across LeetCode, GeeksforGeeks and CodeChef. These are shown as two separately
labelled figures and are never merged into one number.

---

## Performance

Measured on the production build, gzip -9, counting only what a modern browser actually fetches
for `/`.

| | Old site (Vite SPA) | This site |
| --- | --- | --- |
| HTML delivered | **0.4 KB** — empty shell | **297 KB raw / 35 KB gz** — full content |
| First-load JS | 275 KB raw / **87 KB gz** | 585 KB raw / **181 KB gz** |
| CSS | — | 62 KB raw / 11 KB gz |
| Renders without JS | no | yes |

Where this site's 181 KB gz goes:

| | |
| --- | --- |
| Framework floor — React 19 + App Router client runtime | 130 KB gz |
| Framer Motion (`LazyMotion` + `domAnimation`) | 34 KB gz |
| This site's own components | 17 KB gz |
| *(legacy `noModule` polyfill, not fetched by modern browsers)* | *38 KB gz* |

Read that honestly: **total gzipped JS went up, not down.** Two separate reasons, worth
separating.

- **Next.js App Router plus the React 19 client runtime is a ~130 KB gz floor** that a Vite SPA
  does not pay. That is the cost of server-side data fetching and prerendering.
- **Framer Motion adds 34 KB gz.** That number is measured, not estimated: building the same
  tree twice, once with `framer-motion` aliased to a no-op stub, gave 146.0 KB gz against
  180.1 KB gz. Both halves of that pair come from the same build, which is why they do not match
  the 181 KB above to the decimal — the delta is what the comparison establishes, not the total.
  Restricting the feature bundle to `domAnimation` is doing real work — a plain
  `import { motion }` additionally pulls in layout projection and drag, which are the largest
  parts of the library.


What improved over the old site is time-to-content and interaction cost:

- The old site shipped a 0.4 KB HTML shell, so nothing painted until 275 KB of JS had been
  downloaded, parsed and executed. Crawlers and link previews saw an empty page. This site
  prerenders every section, so the content is in the first response.
- Pointer interaction triggers **zero** React renders, so the four simultaneous cursor
  effects stay on the compositor.
- Scroll-linked motion (rail, parallax) writes MotionValues directly to the element — also
  zero React renders per frame.
- Every reveal animates `transform` and `opacity` only. No blur, width, height or filter
  animations anywhere, so nothing triggers layout during a scroll.
- Framework chunks are content-hashed and immutable-cached, so they are a first-visit cost only.

If raw byte count were the single priority, a static site generator with islands and no
animation library would beat this. Next.js and Framer Motion were both deliberate choices —
server-side data fetching and prerendering from the first, sequenced scroll motion from the
second.

Other measures: `content-visibility: auto` on below-fold sections, AVIF/WebP via `next/image`,
project screenshots imported statically so their intrinsic size is known at build time (no layout
shift, and a blur placeholder while they decode), `next/font` self-hosting (no external font
request), particle canvas capped at DPR 2 with the count scaled to viewport area.

### Verified

Driven with a real headless Chrome at 1280×800, 768×1024 and 375×812 (touch emulation), scrolled
the full page in steps:

- 88 Framer-animated elements — **0 left hidden** at every viewport, no element ever
  permanently stranded by `viewport={{ once: true }}`.
- Under `prefers-reduced-motion: reduce`: 0 of 88 retain a transform, particle canvas never
  initialises, custom cursor absent.
- On touch emulation: particle canvas never initialises, custom cursor absent.
- Progress rail tracks scroll `0.005 → 0.542 → 1.0`; About portrait parallax drifts
  `+1.86px → −19.28px`; press feedback measures `1 → 1.03 hover → 0.971 press`.
- No horizontal overflow at any width. No console errors, no page errors, no failed requests.
- Eight keyboard tab stops from skip-link through nav, every one with a visible focus ring.


---

## Accessibility and degradation

- `prefers-reduced-motion: reduce` removes the particle field, aurora, spotlight, custom
  cursor, tilt, magnetism and scramble; reveals resolve to fully visible. Checked once via
  `matchMedia`, never per frame. For Framer Motion the single `MotionConfig reducedMotion="user"`
  covers every animation at once — verified as 0 of 88 elements retaining a transform.
- `(hover: none)` drops all pointer chrome on touch and restores the native cursor.
- The custom cursor only hides the native one when it is actually running, so a browser that
  fails the guards never ends up with no cursor at all.
- **Works with JavaScript disabled.** Framer Motion writes its `initial` state as inline styles
  into the server HTML, so without JS the content would be present in the markup but invisible —
  fine for crawlers reading the DOM, bad for a human with JS off. A four-rule
  `<noscript><style>` block in [`app/layout.tsx`](app/layout.tsx) forces every `[data-stair]`,
  `[data-reveal]` and word mask visible; `!important` wins because inline styles carry no
  priority. This also closes the same gap in the CSS reveal system, which previously had no
  no-JS fallback.
- Headings split into per-word masks carry the full text in `aria-label`, with the visual spans
  `aria-hidden`, and a real space text node between masks so lines wrap and copy-paste normally.
  Word-level only, never per-character.
- Word masks add `padding-bottom: 0.14em; margin-bottom: -0.14em` so `overflow: hidden` does not
  shave the descenders off g, j, p and y — visible on titles like "Things I have built and shipped."
- The hero's cycling role (`RoleCycle`) mutates one text node rather than cross-fading stacked
  words, because the h1's `background-clip: text` gradient clips to the glyphs of *every* in-flow
  descendant — hidden or not — so stacked words would all show at once. The churning span is
  `aria-hidden` with the canonical word in an `sr-only` sibling, so the heading's accessible name
  stays "I build full-stack web apps." throughout. Under reduced motion it never cycles.
- The hero stat cards reserve a fixed label-row height, so the four numbers share a baseline
  whether a card carries a `Live` badge or not. That row also wraps: at 375px the 2-up column is
  narrower than the word "Contributions", and without wrapping the label slid underneath the
  badge, which is `shrink-0`.
- Skip link, visible `:focus-visible` rings, `aria-live` on the copy-to-clipboard buttons, and
  the clipboard buttons sit next to real `mailto:`/`tel:` links so the value is reachable if
  the clipboard API is blocked.
- JSON-LD `Person` schema plus generated OG image and favicon.

---

## Layout

```
app/          layout · page · globals.css · opengraph-image · icon · robots · sitemap
components/
  fx/         PointerProvider · Backdrop · ParticleField · Panel · Reveal · RevealRoot
              Magnetic · Counter · Scramble · RoleCycle · SpotlightText · useCardPointer
  motion/     MotionRoot · Stair · StairText · Parallax · ScrollRail · Pressable
  layout/     Nav · Footer · SectionHeading
  sections/   Hero · Signal · About · Work · Stack · Experience · Education
              Credentials · Contact
  widgets/    LiveClock · Heatmap · DifficultyRings · ActivityFeed · CopyField
content/      profile.ts · projects.ts
lib/          pointer.ts · motion.ts · data.ts · hooks.ts · util.ts
```

## Deploying

Push to a Git remote and import the repo on Vercel — no configuration needed. The page is
statically prerendered with `revalidate = 1800`, so live stats refresh every 30 minutes on
their own.
