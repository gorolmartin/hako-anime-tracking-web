# Cursor Prompt: Scroll-Animated Features Section

## Overview

Build a **Features Section** component for a Next.js (TypeScript) landing page. The section has **text on the left** and a **phone mockup on the right** that is sticky while scrolling. As the user scrolls, the phone transitions through 5 app screens with choreographed animations. Use **motion.dev** (`motion/react`) for all animations driven by scroll progress.

---

## Architecture

Create these files:

```
components/
  FeaturesSection/
    FeaturesSection.tsx    — main section with scroll logic
    PhoneFrame.tsx         — the phone bezel/frame wrapper
    screens/
      Screen1Login.tsx     — onboarding/login screen
      Screen2Home.tsx      — home feed with anime cards
      Screen3Drawer.tsx    — action drawer overlay on home feed
      Screen4Airing.tsx    — airing schedule with calendar
      Screen5Explore.tsx   — explore/discover screen
    FeaturesSection.module.css  — styles (or use Tailwind, match existing project)
```

---

## Layout Structure

```
<section> (height: 500vh — tall enough for 5 scroll "stops")
  <div className="sticky-container"> (position: sticky; top: 0; height: 100vh)
    <div className="two-column-grid">
      
      <!-- LEFT: Feature text (changes per screen) -->
      <div className="feature-text">
        <AnimatePresence mode="wait">
          <motion.div key={activeScreen}>
            <span className="tag">{tag}</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <!-- RIGHT: Phone mockup (sticky) -->
      <div className="phone-wrapper">
        <PhoneFrame>
          {/* Screens render here based on scroll progress */}
        </PhoneFrame>
      </div>

    </div>
  </div>
</section>
```

---

## Scroll Mechanics

Use `useScroll` from `motion/react` targeting the outer section ref:

```tsx
const sectionRef = useRef<HTMLDivElement>(null);
const { scrollYProgress } = useScroll({
  target: sectionRef,
  offset: ["start start", "end end"],
});
```

Map `scrollYProgress` (0 → 1) to 5 screen segments:

| Progress Range | Active Screen | Transition |
|---|---|---|
| `0.00 – 0.15` | Screen 1 (Login) | Static, fully visible |
| `0.15 – 0.25` | Transition 1→2 | Login button scales down to 0, screen 1 fades out, screen 2 elements stagger in |
| `0.25 – 0.35` | Screen 2 (Home) | Static, fully visible |
| `0.35 – 0.45` | Transition 2→3 | First anime card scales down, action drawer slides up from bottom |
| `0.45 – 0.55` | Screen 3 (Drawer) | Static, fully visible |
| `0.55 – 0.65` | Transition 3→4 | Drawer slides back down, airing screen elements stagger in |
| `0.65 – 0.75` | Screen 4 (Airing) | Static, fully visible |
| `0.75 – 0.85` | Transition 4→5 | Airing elements animate out (fade up), explore elements stagger in |
| `0.85 – 1.00` | Screen 5 (Explore) | Static, fully visible |

Use `useTransform` to derive per-screen opacity and element transforms from `scrollYProgress`.

---

## Transition Animations (Detailed)

### Transition 1 → 2: Login → Home Feed
- **Out:** The blue "Login with AniList" button scales from `scale(1)` → `scale(0)` with `transform-origin: center`. The rest of screen 1 fades out (`opacity: 1 → 0`).
- **In:** Screen 2 elements stagger in:
  1. Header text ("Good afternoon, you have new episodes across 3 shows") — fade in + slide up (`y: 20 → 0`)
  2. Filter pills ("Airing · 5", "In Progress · 15", "Plan to Watch") — fade in + slide up, 100ms stagger
  3. Anime cards — scale in from `scale(0.8)` → `scale(1)` + fade in, 150ms stagger
  4. Bottom tab bar — slide up from `y: 20` → `y: 0` + fade in

### Transition 2 → 3: Home Feed → Action Drawer
- **Out:** The first anime card ("Frieren: Beyond Journey’s End Season 2") scales down `scale(1)` → `scale(0.9)` and dims slightly.
- **In:** A semi-transparent dark overlay fades in over the home screen. The action drawer slides up from `translateY(100%)` → `translateY(0)`:
  - Drawer contains: anime thumbnail + title row, episode counter (−/05/+), status options (Watching ✓, Completed, Plan to Watch, Pause, Drop) — each status row staggers in with `y: 15 → 0` at 60ms intervals.

### Transition 3 → 4: Action Drawer → Airing Schedule
- **Out:** Action drawer slides down `translateY(0)` → `translateY(100%)` + overlay fades out. Entire home screen fades out.
- **In:** Airing screen elements stagger in:
  1. Week calendar row (Mon–Sun with "14 Wed" highlighted in blue) — fade in + slide down (`y: -15 → 0`)
  2. "Airing" title + "Winter Season 2026" subtitle — fade in + slide up
  3. Anime schedule items (each with thumbnail, time badge, title, episode) — stagger in from right (`x: 30 → 0`) at 100ms intervals
  4. "+" buttons on each item — pop in with `scale(0) → scale(1)` slightly delayed

### Transition 4 → 5: Airing → Explore
- **Out:** Airing elements animate out — slide up + fade out (`y: 0 → -20, opacity: 1 → 0`), staggered.
- **In:** Explore screen elements stagger in:
  1. "⭐ Popular this season" label — fade in + slide up
  2. Large featured card — scale in `scale(0.9) → scale(1)` + fade in
  3. Horizontal scroll row of small cards — slide in from right (`x: 40 → 0`) 
  4. "🔥 Trending now" label + horizontal cards row — same pattern, 150ms delayed
  5. "📅 Upcoming next season" label + cards — same, another 150ms
  6. Search bar at bottom — slide up from `y: 20 → 0` + fade in, last element

---

## Screen Content Details (UI mockup content)

### Screen 1 — Login
- Dark background with a retro TV illustration (or a placeholder image/SVG) in upper half
- Title: "Where your anime journey shines"
- Subtitle: "Track adventures, discover new favorites, and join conversations with fellow fans."
- Blue rounded button: "Login with AniList"
- Footer text: "Don't have an account? Sign up on AniList ↗"

### Screen 2 — Home Feed
- Status bar: 9:41, signal, wifi, battery icons
- Greeting: "Good afternoon, you have new episodes across 💬 1 show"
- Horizontal pills: "🔥 Airing · 5" | "▶ In Progress · 15" | "📋 Plan to Wa..."
- Anime cards in a 2-column grid showing:
  - "Frieren: Beyond Journey’s End Season 2" — red badge "2 episodes behind", NEXT IN 18H:1M
  - "Hell’s Paradise Season 2" — gray badge "Up to date", NEXT IN 2D:22H:11M
  - "JUJUTSU KAISEN Season 3: The Culling Game Part 1" — NEXT IN 13D:22H:54M  
  - (partial 4th card)
- Bottom tab bar: 5 icons (home, calendar, fire/discover, edit, profile)

### Screen 3 — Action Drawer (overlays Screen 2)
- Background: dimmed Screen 2
- Drawer card (dark rounded rectangle, slides up from bottom):
  - Top row: anime cover thumbnail + "Frieren: Beyond Journey’s End Season 2" + "12 episodes"
  - "UPDATE PROGRESS" label
  - Episode counter: [ − ] 03 EPISODE [ + ] (plus button is blue/filled)
  - "SET STATUS" label
  - Status rows (each in a rounded dark card):
    - 👁 Watching (selected/highlighted)
    - ✅ Completed
    - 📋 Plan to watch
    - ⏸ Pause
    - 🗑 Drop

### Screen 4 — Airing Schedule
- Status bar
- Week day selector: 12 Mon, 13 Tue, **14 Wed** (highlighted blue circle), 15 Thu, 16 Fri, 17 Sat, 19 Sun
- "Airing" heading + "Winter Season 2026" subheading
- List of airing anime:
  - "The Daily Life of the Immortal King 5" — Episode 10 — time: 11:59 — [ + ] button
  - "SI-VIS: The Sound of Heroes" — Episode 18 — time: 12:00 — ✓ (green check = already tracked)
  - "Digimon Beatbreak" — Episode 18 — time: 14:30 — [ + ] button
  - "In the Clear Moonlit Dusk" — Episode 05 — time: 14:30 — [ + ] button
  - "You and I Are Polar Opposites" — Episode 05 — time: 15:00 — [ + ] button
- Bottom tab bar

### Screen 5 — Explore
- "⭐ Popular this season" — large hero card + horizontal scroll of smaller cards:
  - Cards: "Frieren: Beyond Journey’s End Season ", "JUJUTSU KAISEN Season 3: The Culling Game Part 1"
- "🔥 Trending now" — horizontal cards: "Frieren", "Hell’s Paradise Season 2", "Sentenced to Be a Hero", "Frieren: Beyond Journey’s End..."
- "📅 Upcoming next season" — horizontal cards
- Search bar at bottom: "🔍 Search anime or apply filters..."
- Bottom tab bar

---

## Feature Text (Left Side) — Changes per Active Screen

| Screen | Tag | Title | Description |
|---|---|---|---|
| 1 | `Welcome` | Your Anime Life, Organized | Sign in with AniList and your entire watchlist syncs instantly. Pick up right where you left off. |
| 2 | `Home` | Everything at a Glance | See new episodes, track your progress, and manage your watchlist from a single, beautiful home screen. |
| 3 | `Quick Actions` | Update in a Tap | Log episodes, change status, and organize your list without breaking your flow. Quick, effortless, done. |
| 4 | `Schedule` | Never Miss a Drop | A weekly airing calendar shows exactly when your shows release. Stay ahead, not behind. |
| 5 | `Discover` | Find Your Next Obsession | Browse seasonal hits, trending titles, and upcoming releases. Your next favorite anime is one scroll away. |

Animate text transitions with `AnimatePresence mode="wait"` — outgoing text fades out + slides up, incoming text fades in + slides up from below.

---

## Technical Requirements

1. **motion.dev (`motion/react`)** — use `useScroll`, `useTransform`, `useMotionValueEvent`, `motion.*`, `AnimatePresence`
2. **"use client"** directive on all components using motion hooks
3. **Responsive**: On mobile (< 768px), stack vertically — text on top, phone below (still sticky). Reduce section height to 400vh.
4. **Performance**: Use `will-change: transform` on animated elements. Avoid layout-triggering properties. Prefer `transform` and `opacity` for animations.
5. **Phone frame**: Pure CSS — dark rounded rectangle with notch/dynamic island at top, home indicator bar at bottom. Aspect ratio ≈ 9:19.5 (iPhone proportions). Inner screen area has `overflow: hidden` and `border-radius` matching the phone corners.
6. **Color palette**: 
   - Background: `#000000` or `#050505`
   - Phone bezel: `#1a1a1a` with subtle border `#2a2a2a`
   - Screen background: `#0a0a0f` to `#0f1015`
   - Blue accent: `#3b82f6` (buttons, highlights)
   - Text: `#ffffff` primary, `#9ca3af` secondary
   - Card backgrounds: `#1a1d23`
   - Red badge: `#ef4444`
   - Green check: `#22c55e`
7. **No real images needed** — use colored placeholder rectangles with rounded corners for anime thumbnails (use different hues: purple, teal, blue, orange, etc.) or simple gradient blocks. The focus is on animation quality, not image content.
8. **Typography**: Use the project's existing font. Fallback: system sans-serif.

---

## Implementation Tips

- Derive `activeScreen` from `scrollYProgress` using `useMotionValueEvent` to set state for the left-side text.
- For per-element scroll transforms within a screen, use `useTransform(scrollYProgress, [rangeStart, rangeEnd], [fromValue, toValue])` to drive individual element properties.
- The action drawer (Screen 3) is an **overlay on Screen 2** — render Screen 2 underneath with reduced opacity/scale, and the drawer on top.
- Keep all screen components as separate files for maintainability.
- Test scroll behavior thoroughly — animations should feel smooth and connected, not jumpy.

---

## Example Scroll Hook Setup

```tsx
"use client";
import { useRef } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "motion/react";

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Derive which screen is active (for left-side text)
  const [activeScreen, setActiveScreen] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v < 0.2) setActiveScreen(0);
    else if (v < 0.4) setActiveScreen(1);
    else if (v < 0.6) setActiveScreen(2);
    else if (v < 0.8) setActiveScreen(3);
    else setActiveScreen(4);
  });

  // Example: Screen 1 login button scale
  const s1ButtonScale = useTransform(scrollYProgress, [0.12, 0.22], [1, 0]);
  // Example: Screen 2 overall opacity
  const s2Opacity = useTransform(scrollYProgress, [0.15, 0.22, 0.38, 0.45], [0, 1, 1, 0]);
  // Example: Drawer translateY
  const drawerY = useTransform(scrollYProgress, [0.35, 0.45, 0.55, 0.62], ["100%", "0%", "0%", "100%"]);

  return (
    <section ref={sectionRef} style={{ height: "500vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh" }}>
        {/* ... layout here ... */}
      </div>
    </section>
  );
}
```
