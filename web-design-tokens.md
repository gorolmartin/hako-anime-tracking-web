# Design Tokens — Web Landing Page

## Stack: Next.js 14 · TypeScript · Tailwind CSS 4

> Paste the relevant sections into your `globals.css` and `tailwind.config.ts`. All color values use OKLCH with hex fallbacks. Typography is based on Overused Grotesk with a 110% line-height rule.

---

## Font Setup

Install Overused Grotesk as a local font or load from CDN:

```tsx
// app/layout.tsx
import localFont from "next/font/local";

const overusedGrotesk = localFont({
  src: "./fonts/OverusedGrotesk-VF.woff2",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${overusedGrotesk.variable} dark`}>
      <body>{children}</body>
    </html>
  );
}
```

Download the variable font file from: https://github.com/AdrienGlique/Overused-Grotesk
Place in `app/fonts/OverusedGrotesk-VF.woff2`

---

## CSS Custom Properties

Paste into `app/globals.css`:

```css
@import "tailwindcss";

@theme {
  /* ─── Font ─── */
  --font-sans: var(--font-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  /* ─── Gray (hue 264°, from #07080A) ─── */
  --color-gray-50: oklch(98.5% 0.0059 264);   /* #F8FAFE */
  --color-gray-100: oklch(95.5% 0.0078 264);  /* #EDF0F6 */
  --color-gray-150: oklch(92.5% 0.0097 264);  /* #E3E6ED */
  --color-gray-200: oklch(88.0% 0.0124 264);  /* #D3D8E0 */
  --color-gray-300: oklch(78.0% 0.0177 264);  /* #B2B8C3 */
  --color-gray-400: oklch(65.0% 0.0228 264);  /* #888F9E */
  --color-gray-500: oklch(52.0% 0.0250 264);  /* #626978 */
  --color-gray-600: oklch(42.0% 0.0244 264);  /* #464D5B */
  --color-gray-700: oklch(33.0% 0.0222 264);  /* #303541 */
  --color-gray-800: oklch(24.0% 0.0187 264);  /* #1B1F28 */
  --color-gray-850: oklch(19.0% 0.0162 264);  /* #10141B */
  --color-gray-900: oklch(15.0% 0.0141 264);  /* #080B11 */
  --color-gray-925: oklch(11.0% 0.0118 264);  /* #030408 */
  --color-gray-950: oklch(7.0% 0.0094 264);   /* #010102 */
  --color-gray-975: oklch(3.5% 0.0072 264);   /* #000000 */

  /* ─── Blue (hue 255°, from #0B84FF) ─── */
  --color-blue-50: oklch(97.0% 0.0140 255);   /* #EFF6FF */
  --color-blue-100: oklch(94.0% 0.0350 255);  /* #DCEDFF */
  --color-blue-200: oklch(87.0% 0.0750 255);  /* #B3D7FF */
  --color-blue-300: oklch(79.0% 0.1200 255);  /* #85BEFF */
  --color-blue-400: oklch(71.0% 0.1650 255);  /* #53A3FF */
  --color-blue-500: oklch(63.0% 0.2000 255);  /* #1387FE */
  --color-blue-600: oklch(55.0% 0.1950 255);  /* #006EDF */
  --color-blue-700: oklch(46.0% 0.1700 255);  /* #0054B3 */
  --color-blue-800: oklch(37.0% 0.1350 255);  /* #003D84 */
  --color-blue-900: oklch(29.0% 0.0950 255);  /* #002A59 */
  --color-blue-950: oklch(21.0% 0.0550 255);  /* #051831 */

  /* ─── Coral (hue 30°, from #EE6447) ─── */
  --color-coral-50: oklch(97.0% 0.0150 30);   /* #FFF2EF */
  --color-coral-100: oklch(93.0% 0.0400 30);  /* #FFDFD8 */
  --color-coral-200: oklch(86.0% 0.0900 30);  /* #FFBBAE */
  --color-coral-300: oklch(78.0% 0.1450 30);  /* #FF917F */
  --color-coral-400: oklch(70.0% 0.1800 30);  /* #FA6A57 */
  --color-coral-500: oklch(63.0% 0.1950 30);  /* #E74B39 */
  --color-coral-600: oklch(55.0% 0.1800 30);  /* #C53829 */
  --color-coral-700: oklch(46.0% 0.1500 30);  /* #9A2A1E */
  --color-coral-800: oklch(37.0% 0.1150 30);  /* #702016 */
  --color-coral-900: oklch(29.0% 0.0800 30);  /* #4C1811 */
  --color-coral-950: oklch(21.0% 0.0450 30);  /* #2A0F0B */

  /* ─── Green (hue 155°, success) ─── */
  --color-green-50: oklch(97.0% 0.0150 155);  /* #EEF8F1 */
  --color-green-100: oklch(94.0% 0.0400 155); /* #D7F4E0 */
  --color-green-200: oklch(87.0% 0.0850 155); /* #A8E5BC */
  --color-green-300: oklch(79.0% 0.1350 155); /* #6BD494 */
  --color-green-400: oklch(71.0% 0.1700 155); /* #1BBF70 */
  --color-green-500: oklch(63.0% 0.1750 155); /* #00A657 */
  --color-green-600: oklch(55.0% 0.1550 155); /* #008A46 */
  --color-green-700: oklch(46.0% 0.1300 155); /* #006C35 */
  --color-green-800: oklch(37.0% 0.1000 155); /* #004E27 */
  --color-green-900: oklch(29.0% 0.0700 155); /* #02351B */
  --color-green-950: oklch(21.0% 0.0400 155); /* #071E10 */

  /* ─── Red (hue 12°, error) ─── */
  --color-red-50: oklch(97.0% 0.0150 12);     /* #FFF1F2 */
  --color-red-100: oklch(93.0% 0.0400 12);    /* #FFDEE1 */
  --color-red-200: oklch(86.0% 0.0900 12);    /* #FFB9C1 */
  --color-red-300: oklch(78.0% 0.1450 12);    /* #FF8E9F */
  --color-red-400: oklch(70.0% 0.1850 12);    /* #FB637F */
  --color-red-500: oklch(63.0% 0.2050 12);    /* #E94067 */
  --color-red-600: oklch(55.0% 0.1950 12);    /* #C92852 */
  --color-red-700: oklch(46.0% 0.1650 12);    /* #9E1B3F */
  --color-red-800: oklch(37.0% 0.1250 12);    /* #73172E */
  --color-red-900: oklch(29.0% 0.0880 12);    /* #4E131F */
  --color-red-950: oklch(21.0% 0.0500 12);    /* #2B0D12 */

  /* ─── Semantic (dark default) ─── */
  --color-bg-app: var(--color-gray-950);
  --color-bg-surface: var(--color-gray-925);
  --color-bg-surface-raised: var(--color-gray-900);
  --color-bg-surface-overlay: var(--color-gray-850);
  --color-bg-interactive: var(--color-gray-800);
  --color-bg-interactive-hover: var(--color-gray-700);

  --color-border-subtle: var(--color-gray-925);
  --color-border-default: var(--color-gray-850);
  --color-border-strong: var(--color-gray-700);

  --color-text-primary: var(--color-gray-50);
  --color-text-secondary: var(--color-gray-300);
  --color-text-tertiary: var(--color-gray-500);
  --color-text-disabled: var(--color-gray-700);
  --color-text-on-fill: var(--color-gray-50);

  --color-accent-blue: var(--color-blue-500);
  --color-accent-blue-hover: var(--color-blue-400);
  --color-accent-blue-muted: var(--color-blue-950);
  --color-accent-blue-text: var(--color-blue-400);

  --color-accent-coral: var(--color-coral-400);
  --color-accent-coral-hover: var(--color-coral-300);
  --color-accent-coral-muted: var(--color-coral-950);
  --color-accent-coral-text: var(--color-coral-400);

  --color-success: var(--color-green-500);
  --color-success-hover: var(--color-green-400);
  --color-success-muted: var(--color-green-950);
  --color-success-text: var(--color-green-400);

  --color-error: var(--color-red-500);
  --color-error-hover: var(--color-red-400);
  --color-error-muted: var(--color-red-950);
  --color-error-text: var(--color-red-400);

  /* ─── Typography ─── */
  --text-display: 3.5rem;
  --text-h1: 2.5rem;
  --text-h2: 2rem;
  --text-h3: 1.5rem;
  --text-h4: 1.25rem;
  --text-h5: 1.0625rem;
  --text-body-lg: 1.125rem;
  --text-body: 1rem;
  --text-body-sm: 0.875rem;
  --text-caption: 0.8125rem;
  --text-overline: 0.6875rem;
  --text-micro: 0.625rem;

  --leading-display: calc(62 / 56);
  --leading-h1: calc(44 / 40);
  --leading-h2: calc(35 / 32);
  --leading-h3: calc(26 / 24);
  --leading-h4: calc(22 / 20);
  --leading-h5: calc(19 / 17);
  --leading-body-lg: calc(20 / 18);
  --leading-body: calc(18 / 16);
  --leading-body-sm: calc(15 / 14);
  --leading-caption: calc(14 / 13);
  --leading-overline: calc(12 / 11);
  --leading-micro: calc(11 / 10);

  --tracking-display: -0.03em;
  --tracking-h1: -0.025em;
  --tracking-h2: -0.02em;
  --tracking-h3: -0.015em;
  --tracking-h4: -0.01em;
  --tracking-h5: -0.005em;
  --tracking-body-lg: 0em;
  --tracking-body: 0em;
  --tracking-body-sm: 0.005em;
  --tracking-caption: 0.01em;
  --tracking-overline: 0.08em;
  --tracking-micro: 0.04em;
}

/* ─── Light mode overrides ─── */
.light {
  --color-bg-app: var(--color-gray-50);
  --color-bg-surface: var(--color-gray-100);
  --color-bg-surface-raised: var(--color-gray-150);
  --color-bg-interactive: var(--color-gray-200);
  --color-bg-interactive-hover: var(--color-gray-300);

  --color-border-subtle: var(--color-gray-150);
  --color-border-default: var(--color-gray-200);
  --color-border-strong: var(--color-gray-400);

  --color-text-primary: var(--color-gray-950);
  --color-text-secondary: var(--color-gray-600);
  --color-text-tertiary: var(--color-gray-500);
  --color-text-disabled: var(--color-gray-300);
  --color-text-on-fill: var(--color-gray-50);

  --color-accent-blue: var(--color-blue-600);
  --color-accent-blue-hover: var(--color-blue-700);
  --color-accent-blue-muted: var(--color-blue-50);
  --color-accent-blue-text: var(--color-blue-600);

  --color-accent-coral: var(--color-coral-500);
  --color-accent-coral-hover: var(--color-coral-600);
  --color-accent-coral-muted: var(--color-coral-50);
  --color-accent-coral-text: var(--color-coral-600);

  --color-success: var(--color-green-600);
  --color-success-hover: var(--color-green-700);
  --color-success-muted: var(--color-green-50);
  --color-success-text: var(--color-green-600);

  --color-error: var(--color-red-600);
  --color-error-hover: var(--color-red-700);
  --color-error-muted: var(--color-red-50);
  --color-error-text: var(--color-red-600);
}
```

---

## Tailwind Usage

After the `@theme` block registers the custom properties, Tailwind CSS 4 automatically generates utility classes. Use them directly:

### Colors

```html
<!-- Primitives -->
<div class="bg-gray-950 text-gray-50" />
<div class="bg-blue-500 text-blue-50" />
<div class="border-coral-400" />

<!-- Semantic -->
<div class="bg-bg-app text-text-primary" />
<div class="bg-bg-surface border-border-default" />
<div class="bg-accent-blue text-text-on-fill" />
<div class="bg-accent-coral-muted text-accent-coral-text" />
<div class="bg-success-muted text-success-text" />
<div class="bg-error text-text-on-fill" />
```

### Typography

```html
<!-- Display heading -->
<h1 class="text-display leading-display tracking-display font-medium" />

<!-- Page title -->
<h1 class="text-h1 leading-h1 tracking-h1 font-medium" />

<!-- Body text -->
<p class="text-body leading-body tracking-body font-normal" />

<!-- Overline label -->
<span class="text-overline leading-overline tracking-overline font-semibold uppercase" />

<!-- Caption -->
<span class="text-caption leading-caption tracking-caption font-normal" />
```

---

## Typography Quick Reference

| Class | Size | LH | Tracking | Weight | Use |
|-------|------|----|----------|--------|-----|
| `text-display` | 56px / 3.5rem | 1.107 | -0.03em | `font-medium` | Hero headlines |
| `text-h1` | 40px / 2.5rem | 1.1 | -0.025em | `font-medium` | Page titles |
| `text-h2` | 32px / 2rem | 1.094 | -0.02em | `font-medium` | Section titles |
| `text-h3` | 24px / 1.5rem | 1.083 | -0.015em | `font-medium` | Subsections |
| `text-h4` | 20px / 1.25rem | 1.1 | -0.01em | `font-medium` | Card titles |
| `text-h5` | 17px / 1.0625rem | 1.118 | -0.005em | `font-medium` | Small headings |
| `text-body-lg` | 18px / 1.125rem | 1.111 | 0 | `font-normal` | Lead paragraphs |
| `text-body` | 16px / 1rem | 1.125 | 0 | `font-normal` | Default body |
| `text-body-sm` | 14px / 0.875rem | 1.071 | 0.005em | `font-normal` | Supporting text |
| `text-caption` | 13px / 0.8125rem | 1.077 | 0.01em | `font-normal` | Metadata |
| `text-overline` | 11px / 0.6875rem | 1.091 | 0.08em | `font-semibold` + `uppercase` | Labels |
| `text-micro` | 10px / 0.625rem | 1.1 | 0.04em | `font-medium` | Fine print |

### Weight mapping

| Tailwind class | Weight | Use |
|----------------|--------|-----|
| `font-normal` | 400 | Body, descriptions, captions |
| `font-medium` | 500 | Headings, titles, buttons |
| `font-semibold` | 600 | Overlines only |

---

## Semantic Color Quick Reference

| Token | Tailwind class | Dark | Light |
|-------|---------------|------|-------|
| App bg | `bg-bg-app` | gray-950 | gray-50 |
| Surface | `bg-bg-surface` | gray-925 | gray-100 |
| Raised | `bg-bg-surface-raised` | gray-900 | gray-150 |
| Overlay | `bg-bg-surface-overlay` | gray-850 | — |
| Interactive | `bg-bg-interactive` | gray-800 | gray-200 |
| Interactive hover | `bg-bg-interactive-hover` | gray-700 | gray-300 |
| Border subtle | `border-border-subtle` | gray-925 | gray-150 |
| Border default | `border-border-default` | gray-850 | gray-200 |
| Border strong | `border-border-strong` | gray-700 | gray-400 |
| Text primary | `text-text-primary` | gray-50 | gray-950 |
| Text secondary | `text-text-secondary` | gray-300 | gray-600 |
| Text tertiary | `text-text-tertiary` | gray-500 | gray-500 |
| Text disabled | `text-text-disabled` | gray-700 | gray-300 |
| Text on fill | `text-text-on-fill` | gray-50 | gray-50 |
| Blue accent | `bg-accent-blue` | blue-500 | blue-600 |
| Blue hover | `bg-accent-blue-hover` | blue-400 | blue-700 |
| Blue muted | `bg-accent-blue-muted` | blue-950 | blue-50 |
| Blue text | `text-accent-blue-text` | blue-400 | blue-600 |
| Coral accent | `bg-accent-coral` | coral-400 | coral-500 |
| Coral hover | `bg-accent-coral-hover` | coral-300 | coral-600 |
| Coral muted | `bg-accent-coral-muted` | coral-950 | coral-50 |
| Coral text | `text-accent-coral-text` | coral-400 | coral-600 |
| Success | `bg-success` | green-500 | green-600 |
| Success text | `text-success-text` | green-400 | green-600 |
| Error | `bg-error` | red-500 | red-600 |
| Error text | `text-error-text` | red-400 | red-600 |

---

## Rules

1. **Always use semantic tokens** for surfaces, text, borders — not raw primitives.
2. **Dark theme is the default** — `<html class="dark">`. Add `class="light"` to switch.
3. **Three weights only**: `font-normal` (400), `font-medium` (500), `font-semibold` (600). Never bold.
4. **Overlines are always**: `text-overline leading-overline tracking-overline font-semibold uppercase`.
5. **Line-height rule**: 110% across the board (`round(size × 1.1)`).
6. **Tracking tightens as size grows**: display -0.03em → body 0em → overline +0.08em.
7. **Coral ≠ Red**: Coral (hue 30°) is brand personality. Red (hue 12°) is error/danger. Never interchange.
8. **Text on filled buttons**: always `text-text-on-fill` regardless of theme.
