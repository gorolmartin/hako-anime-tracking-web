# Cursor Prompt: Refactor Features Section — Replace Coded Screens with Figma Image Slices

## Context

We already have a working `FeaturesSection` with:
- A sticky two-column layout (text left, phone right) inside a `500vh` scroll container
- `useScroll` / `useTransform` from `motion/react` driving transitions based on `scrollYProgress`
- 5 screens rendered inside a `PhoneFrame` component with scroll-driven animations
- Left-side feature text that swaps via `AnimatePresence`

**The problem:** The screens are coded from scratch with placeholder UI and don't match the actual app design. We're going to replace all hand-coded screen content with **cropped Figma exports** (PNG images) while keeping the exact same scroll mechanics and animation choreography.

---

## What to Do

### 1. Remove all hand-coded screen UI

Strip out all the fake UI markup (placeholder cards, text elements, icons, status bars, etc.) from every screen component. We're replacing that content with `<img>` tags pointing to pre-sliced Figma exports. **Keep all motion wrappers, scroll transforms, and animation logic intact** — only the inner content changes.

### 2. Add images to the project

I will place the exported slices in:

```
public/features/
  s1-background.png        — Screen 1: full screen background (TV illustration + text)
  s1-button.png             — Screen 1: the blue "Login with AniList" button
  s2-full.png               — Screen 2: full home feed screen
  s2-first-card.png         — Screen 2: just the first anime card ("Frieren: Beyond Journey’s End Season 2")
  s2-behind-drawer.png      — Screen 2: the dimmed/blurred version of home screen (used as drawer backdrop)
  s3-drawer.png             — Screen 3: the action drawer panel only (transparent background PNG)
  s4-calendar.png           — Screen 4: the week calendar row only (transparent background)
  s4-header.png             — Screen 4: "Airing" title + "Winter Season 2026" subtitle (transparent)
  s4-list.png               — Screen 4: the anime schedule list (transparent)
  s5-popular.png            — Screen 5: "Popular this season" section with cards
  s5-trending.png           — Screen 5: "Trending now" section with cards
  s5-upcoming.png           — Screen 5: "Upcoming next season" section with cards
  s5-search.png             — Screen 5: the search bar at the bottom
  tab-bar.png               — Shared: bottom tab bar (used in screens 2, 4, 5)
  status-bar.png            — Shared: iOS status bar with time/signal/battery
```

All exported at **2x resolution**, PNGs with transparency where noted.

### 3. Refactor each screen component

Replace coded markup with image layers wrapped in existing `motion.div` containers. Every image should be:

```tsx
<img
  src="/features/filename.png"
  alt=""
  draggable={false}
  style={{ width: "100%", display: "block" }}
/>
```

Use `alt=""` since these are decorative. Add `draggable={false}` to prevent drag artifacts.

---

## Screen-by-Screen Refactor

### Screen 1 — Login

**Images:** `s1-background.png`, `s1-button.png`

```tsx
{/* Background — fades out during transition */}
<motion.div style={{ opacity: s1Opacity }}>
  <img src="/features/s1-background.png" ... />
</motion.div>

{/* Button — scales down to 0 during transition */}
<motion.div
  style={{
    scale: s1ButtonScale,       // useTransform: [0.12, 0.22] → [1, 0]
    transformOrigin: "center",
    position: "absolute",
    bottom: "80px",             // position to match Figma layout
    left: "24px",
    right: "24px",
  }}
>
  <img src="/features/s1-button.png" ... />
</motion.div>
```

Keep the existing `s1ButtonScale` and `s1Opacity` transforms — just swap the coded button for the image.

---

### Screen 2 — Home Feed

**Images:** `s2-full.png`, `s2-first-card.png`, `status-bar.png`, `tab-bar.png`

For the static state (no drawer), render the full screen as one image:

```tsx
<motion.div style={{ opacity: s2Opacity }}>
  <img src="/features/s2-full.png" ... />
</motion.div>
```

For the **transition into Screen 3**, the first card needs to scale down independently. Layer it on top of the full screen at its exact position (use `position: absolute` + `top`/`left` matching the card's location in the design):

```tsx
{/* First card — scales down as drawer appears */}
<motion.div
  style={{
    scale: s2CardScale,         // useTransform: [0.35, 0.42] → [1, 0.9]
    opacity: s2CardOpacity,     // dims slightly
    position: "absolute",
    top: "XXpx",               // match card position from Figma
    left: "XXpx",
    width: "XXpx",
  }}
>
  <img src="/features/s2-first-card.png" ... />
</motion.div>
```

**Note:** Measure the card's exact `top` and `left` position within the phone screen from Figma and hardcode it. This only needs to be pixel-perfect at the phone frame's fixed size.

---

### Screen 3 — Action Drawer (overlay on Screen 2)

**Images:** `s2-behind-drawer.png`, `s3-drawer.png`

This screen is a **composite**: dimmed home screen + drawer on top.

```tsx
{/* Dimmed backdrop — faded version of home screen */}
<motion.div style={{ opacity: s3BackdropOpacity }}>
  <img src="/features/s2-behind-drawer.png" ... />
</motion.div>

{/* Drawer — slides up from bottom */}
<motion.div
  style={{
    y: drawerY,                 // useTransform: [0.35, 0.45, 0.55, 0.62] → ["100%", "0%", "0%", "100%"]
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  }}
>
  <img src="/features/s3-drawer.png" ... />
</motion.div>
```

The drawer image should be exported with its exact height from Figma (roughly the bottom 60-70% of the screen). Transparent background PNG so the dimmed home screen shows through above it.

---

### Screen 4 — Airing Schedule

**Images:** `s4-calendar.png`, `s4-header.png`, `s4-list.png`, `status-bar.png`, `tab-bar.png`

Three layers staggering in:

```tsx
<motion.div style={{ opacity: s4Opacity }}>

  {/* Status bar */}
  <img src="/features/status-bar.png" ... />

  {/* Calendar — slides down from top */}
  <motion.div style={{ y: s4CalendarY, opacity: s4CalendarOpacity }}>
    <img src="/features/s4-calendar.png" ... />
  </motion.div>

  {/* Header — fades in + slides up */}
  <motion.div style={{ y: s4HeaderY, opacity: s4HeaderOpacity }}>
    <img src="/features/s4-header.png" ... />
  </motion.div>

  {/* Anime list — slides in from right */}
  <motion.div style={{ x: s4ListX, opacity: s4ListOpacity }}>
    <img src="/features/s4-list.png" ... />
  </motion.div>

  {/* Tab bar — slides up */}
  <motion.div style={{ y: s4TabY, opacity: s4TabOpacity }}>
    <img src="/features/tab-bar.png" ... />
  </motion.div>

</motion.div>
```

Each element uses its own `useTransform` with slightly offset ranges to create the stagger effect. Example:

```tsx
const s4CalendarY = useTransform(scrollYProgress, [0.57, 0.63], [-15, 0]);
const s4HeaderY = useTransform(scrollYProgress, [0.59, 0.65], [15, 0]);
const s4ListX = useTransform(scrollYProgress, [0.61, 0.67], [30, 0]);
const s4TabY = useTransform(scrollYProgress, [0.63, 0.68], [20, 0]);
```

---

### Screen 5 — Explore

**Images:** `s5-popular.png`, `s5-trending.png`, `s5-upcoming.png`, `s5-search.png`, `status-bar.png`, `tab-bar.png`

Same staggered-layer approach:

```tsx
<motion.div style={{ opacity: s5Opacity }}>

  <img src="/features/status-bar.png" ... />

  {/* Popular — scale + fade in */}
  <motion.div style={{ scale: s5PopularScale, opacity: s5PopularOpacity }}>
    <img src="/features/s5-popular.png" ... />
  </motion.div>

  {/* Trending — slides from right */}
  <motion.div style={{ x: s5TrendingX, opacity: s5TrendingOpacity }}>
    <img src="/features/s5-trending.png" ... />
  </motion.div>

  {/* Upcoming — slides from right, more delayed */}
  <motion.div style={{ x: s5UpcomingX, opacity: s5UpcomingOpacity }}>
    <img src="/features/s5-upcoming.png" ... />
  </motion.div>

  {/* Search bar — slides up from bottom */}
  <motion.div style={{ y: s5SearchY, opacity: s5SearchOpacity }}>
    <img src="/features/s5-search.png" ... />
  </motion.div>

  <motion.div style={{ y: s5TabY, opacity: s5TabOpacity }}>
    <img src="/features/tab-bar.png" ... />
  </motion.div>

</motion.div>
```

---

## What NOT to Change

- **Keep** the `500vh` section height, sticky container, and two-column layout
- **Keep** all `useScroll`, `useTransform`, `useMotionValueEvent` hooks and their progress ranges (adjust ranges only if transitions feel off after seeing real images)
- **Keep** the left-side `AnimatePresence` text transitions and all feature copy
- **Keep** the `PhoneFrame` component (bezel, notch, home indicator, border radius, overflow hidden)
- **Keep** the `activeScreen` state logic that drives the left-side text

---

## Image Sizing Rules

All images must be exported at the **exact phone screen inner dimensions** (or the exact slice dimensions for partial elements). The phone screen area is a fixed size — measure it from the existing `PhoneFrame` component.

- Full-screen images: match the phone screen inner width and height exactly
- Partial slices (drawer, calendar row, search bar, etc.): match the exact width of the phone screen, crop height to just the element
- Use `width: 100%` on all images so they fill the phone screen container — the container constrains the size
- Export at 2x for Retina. So if the phone screen renders at 280×600 CSS pixels, export images at 560×1200 actual pixels.

---

## Positioning Partial Layers

For screens with multiple image layers, use a stacking approach:

```tsx
<div style={{ position: "relative", width: "100%", height: "100%" }}>
  {/* Full background layer */}
  <img src="..." style={{ width: "100%", position: "absolute", top: 0 }} />

  {/* Partial layer positioned absolutely */}
  <motion.div style={{ position: "absolute", top: "XXpx", left: 0, width: "100%" }}>
    <img src="..." style={{ width: "100%" }} />
  </motion.div>
</div>
```

Get `top` values by measuring from Figma where each section starts within the screen.

---

## Summary of Changes

| Before | After |
|---|---|
| 200+ lines of coded UI per screen | 5–15 lines of `<img>` tags per screen |
| Placeholder colors and fake text | Pixel-perfect Figma exports |
| Hard to maintain and tweak visually | Edit in Figma → re-export → done |
| Complex CSS for layout matching | Simple absolute positioning of image layers |

The scroll animation code stays almost identical. We're just swapping what's inside each `motion.div`.
