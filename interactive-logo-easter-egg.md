# Interactive Logo Easter Egg - Implementation Guide

## Overview
When users click the logo, it bounces and shoots out 4 cards showing the current season's trending anime from AniList. The cards animate outward, rotate, then fade away. This creates a delightful surprise that demonstrates the app's AniList integration.

## ⚠️ IMPORTANT: Figma Card Design Required

**The anime card design MUST be built from this Figma file:**

**Figma URL:** `https://www.figma.com/design/4Gybf22hipOI8rfPmLEgxs/App?node-id=627-5284&t=CKPNGDoYKJo5obPt-11`

**Node ID:** `627-5284` (Anime Card Component)

The code includes a placeholder card design that must be replaced with the exact specifications from the Figma file. See **Step 5: Implement Figma Card Design** for instructions.

**Using Figma MCP:**
Since you have Figma MCP enabled, Cursor can directly access and extract the design specifications from the Figma URL. Just provide the URL in your prompt and Cursor will read the component details automatically.

---

## Step 1: Install Dependencies

```bash
npm install framer-motion
```

---

## Step 2: Create AniList API Helper

Create a new file: `lib/anilist.ts`

```typescript
// lib/anilist.ts

interface AnimeTitle {
  english: string | null;
  romaji: string;
}

interface AnimeCover {
  large: string;
  extraLarge: string;
}

export interface TrendingAnime {
  id: number;
  title: AnimeTitle;
  coverImage: AnimeCover;
}

/**
 * Get current anime season based on month
 */
function getCurrentSeason(): { season: string; year: number } {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const year = now.getFullYear();
  
  let season: string;
  
  if (month >= 0 && month <= 2) {
    season = 'WINTER';
  } else if (month >= 3 && month <= 5) {
    season = 'SPRING';
  } else if (month >= 6 && month <= 8) {
    season = 'SUMMER';
  } else {
    season = 'FALL';
  }
  
  return { season, year };
}

/**
 * Fetch top 4 trending anime from current season via AniList GraphQL API
 */
export async function getSeasonalTrendingAnime(): Promise<TrendingAnime[]> {
  const { season, year } = getCurrentSeason();
  
  const query = `
    query ($season: MediaSeason, $year: Int) {
      Page(page: 1, perPage: 4) {
        media(
          sort: TRENDING_DESC, 
          type: ANIME, 
          season: $season, 
          seasonYear: $year,
          isAdult: false
        ) {
          id
          title {
            english
            romaji
          }
          coverImage {
            large
            extraLarge
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { season, year },
      }),
      // Cache for 1 hour (3600 seconds) to avoid spamming AniList API
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`AniList API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data.Page.media as TrendingAnime[];
  } catch (error) {
    console.error('Failed to fetch trending anime:', error);
    // Return empty array on error - component will handle gracefully
    return [];
  }
}
```

---

## Step 3: Create Interactive Logo Component

**IMPORTANT: The anime card design must be built from the Figma file.**

**Figma URL:** `https://www.figma.com/design/4Gybf22hipOI8rfPmLEgxs/App?node-id=627-5284&t=CKPNGDoYKJo5obPt-11`

**Node ID:** `627-5284`

Since you have Figma MCP enabled, Cursor can read the design directly from this URL. The placeholder card in the code below will be replaced with the exact Figma specifications in Step 5.

---

Create a new file: `components/InteractiveLogo.tsx`

```typescript
// components/InteractiveLogo.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TrendingAnime } from '@/lib/anilist';

interface InteractiveLogoProps {
  trendingAnime: TrendingAnime[];
  children: React.ReactNode; // Your logo component
}

export function InteractiveLogo({ trendingAnime, children }: InteractiveLogoProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    // Prevent spam clicking during animation
    if (isAnimating || trendingAnime.length === 0) return;
    
    setIsAnimating(true);
    setClickCount(prev => prev + 1);
    
    // Show cards after logo bounce animation completes
    setTimeout(() => {
      setShowCards(true);
    }, 300);
    
    // Hide cards and reset after full animation
    setTimeout(() => {
      setShowCards(false);
      setIsAnimating(false);
    }, 3000);
  };

  return (
    <div className="relative inline-block">
      {/* Interactive Logo with Bounce Animation */}
      <motion.button
        onClick={handleClick}
        className="cursor-pointer focus:outline-none relative z-10"
        animate={isAnimating ? {
          scale: [1, 1.2, 0.9, 1.1, 1],
          rotate: [0, -10, 10, -5, 0],
        } : {}}
        transition={{ 
          duration: 0.5,
          ease: [0.34, 1.56, 0.64, 1], // Bouncy easing
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Click for a surprise"
      >
        {children}
      </motion.button>

      {/* Easter Egg Hint (fades after first click) */}
      {clickCount === 0 && trendingAnime.length > 0 && (
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-secondary whitespace-nowrap pointer-events-none"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          psst, click me 👀
        </motion.div>
      )}

      {/* Anime Cards Container */}
      <div className="absolute top-1/2 left-1/2 pointer-events-none z-0">
        <AnimatePresence>
          {showCards && trendingAnime.map((anime, index) => (
            <AnimeCard
              key={anime.id}
              anime={anime}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * Individual Anime Card Component
 * 
 * IMPORTANT: The card design should EXACTLY match the Figma file provided.
 * Use Figma's Dev Mode to extract:
 * - Exact dimensions (width, height)
 * - Border radius values
 * - Shadow specifications (color, blur, spread, offset)
 * - Border styles (width, color, opacity)
 * - Background colors
 * - Title overlay gradient (stops, opacity values)
 * - Typography (font size, weight, line height, letter spacing)
 * - Padding and spacing values
 * - Any other visual details from the design
 * 
 * Do NOT use the placeholder styling below - replace it entirely with
 * the Figma design specifications.
 */
function AnimeCard({ anime, index }: { anime: TrendingAnime; index: number }) {
  return (
    <motion.div
      className="absolute top-0 left-0"
      initial={{
        x: 0,
        y: 0,
        scale: 0,
        opacity: 0,
        rotate: 0,
      }}
      animate={{
        x: getXPosition(index),
        y: getYPosition(index),
        scale: [0, 1.2, 1],
        opacity: [0, 1, 1, 1, 0],
        rotate: getRotation(index),
      }}
      transition={{
        duration: 2.5,
        ease: [0.34, 1.56, 0.64, 1], // Bouncy easing
        times: [0, 0.3, 0.5, 0.8, 1], // Opacity timing
      }}
      exit={{
        opacity: 0,
        scale: 0.8,
      }}
    >
      {/* 
        REPLACE THIS ENTIRE CARD DESIGN WITH FIGMA SPECIFICATIONS
        
        Reference the Figma file to build the exact card structure.
        The card should include:
        - Anime cover image (fill entire card area)
        - Any overlays, gradients, or decorative elements from Figma
        - Title text with exact typography from Figma
        - Proper shadows, borders, and effects
        
        PLACEHOLDER CARD BELOW - DELETE AND REPLACE WITH FIGMA DESIGN:
      */}
      <div className="w-32 h-48 rounded-lg overflow-hidden shadow-2xl shadow-primary/50 border-2 border-primary/30 bg-surface">
        {/* Anime Cover Image */}
        <img
          src={anime.coverImage.extraLarge || anime.coverImage.large}
          alt={anime.title.english || anime.title.romaji}
          className="w-full h-full object-cover"
          loading="eager" // Preload for smooth animation
        />
        
        {/* Title Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-2 pt-6">
          <p className="text-white text-xs font-medium line-clamp-2 leading-tight">
            {anime.title.english || anime.title.romaji}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Position helpers - cards shoot out in 4 directions
 */
function getXPosition(index: number): number {
  const positions = [
    -150,  // Card 1: Left
    150,   // Card 2: Right  
    -120,  // Card 3: Upper-left
    120,   // Card 4: Upper-right
  ];
  return positions[index] ?? 0;
}

function getYPosition(index: number): number {
  const positions = [
    -80,   // Card 1: Slightly up
    -80,   // Card 2: Slightly up
    -180,  // Card 3: Way up
    -180,  // Card 4: Way up
  ];
  return positions[index] ?? 0;
}

function getRotation(index: number): number {
  const rotations = [-15, 15, -25, 25];
  return rotations[index] ?? 0;
}
```

---

## Step 4: Update Your Logo/Header Component

Example integration in your header or hero section:

```tsx
// components/Header.tsx (or wherever your logo lives)
import { getSeasonalTrendingAnime } from '@/lib/anilist';
import { InteractiveLogo } from '@/components/InteractiveLogo';
import YourLogoSVG from '@/components/YourLogoSVG'; // Your actual logo

export async function Header() {
  // Fetch trending anime on server
  const trendingAnime = await getSeasonalTrendingAnime();

  return (
    <header className="...">
      <InteractiveLogo trendingAnime={trendingAnime}>
        <YourLogoSVG className="w-16 h-16" />
      </InteractiveLogo>
      
      {/* Rest of your header */}
    </header>
  );
}
```

Or if you need it client-side:

```tsx
// components/Header.tsx
'use client';

import { useEffect, useState } from 'react';
import { InteractiveLogo } from '@/components/InteractiveLogo';
import type { TrendingAnime } from '@/lib/anilist';

export function Header() {
  const [trendingAnime, setTrendingAnime] = useState<TrendingAnime[]>([]);

  useEffect(() => {
    // Fetch from your API route
    fetch('/api/trending-anime')
      .then(res => res.json())
      .then(data => setTrendingAnime(data))
      .catch(err => console.error('Failed to load trending anime:', err));
  }, []);

  return (
    <header>
      <InteractiveLogo trendingAnime={trendingAnime}>
        <YourLogoSVG />
      </InteractiveLogo>
    </header>
  );
}
```

---

## Step 5: Implement Figma Card Design Using MCP

**Figma File URL:** `https://www.figma.com/design/4Gybf22hipOI8rfPmLEgxs/App?node-id=627-5284&t=CKPNGDoYKJo5obPt-11`

**Component Node ID:** `627-5284`

### Using Figma MCP to Extract Design

Since you have Figma MCP enabled, Cursor can directly read and extract the design specifications from the Figma URL. You don't need to manually copy any values.

### Cursor Prompt for Figma MCP Implementation:

```
Access the Figma file at this URL using Figma MCP:
https://www.figma.com/design/4Gybf22hipOI8rfPmLEgxs/App?node-id=627-5284&t=CKPNGDoYKJo5obPt-11

Extract the design specifications for the node with ID: 627-5284

This is the anime card component. Read all design properties:
- Dimensions (width, height)
- Border radius, borders, shadows
- Typography (font, size, weight, line-height, letter-spacing)
- Colors, gradients, opacity
- Spacing (padding, margins)
- Any overlays, effects, or decorative elements

Then, in components/InteractiveLogo.tsx, find the AnimeCard component and replace the placeholder card design (the <div> inside the motion.div) with the exact Figma specifications.

IMPORTANT: Keep these parts from the original code:
✅ The motion.div wrapper with all animation props
✅ The image src: anime.coverImage.extraLarge || anime.coverImage.large
✅ The title text: anime.title.english || anime.title.romaji
✅ The loading="eager" attribute on the image
✅ The alt text for accessibility

REPLACE these parts with Figma specs:
❌ All card container styling (dimensions, borders, shadows, etc.)
❌ Title overlay design and positioning
❌ Any decorative elements

Build the card to match the Figma design pixel-perfectly using Tailwind classes or inline styles.
```

### What Cursor Will Extract

When Cursor accesses the Figma file via MCP, it will read:

1. **Layout Properties:**
   - Width and height
   - Position and constraints
   - Auto-layout settings (if applicable)

2. **Visual Properties:**
   - Fill colors and gradients
   - Stroke (border) properties
   - Effects (shadows, blurs)
   - Border radius
   - Opacity

3. **Typography:**
   - Font family, size, weight
   - Line height, letter spacing
   - Text color and alignment
   - Text decoration

4. **Component Structure:**
   - Layer hierarchy
   - Image fill properties
   - Overlay elements
   - Text positioning

### Verification Steps

After Cursor implements the Figma design:

1. **Visual Comparison:**
   - Take a screenshot of the implemented card
   - Compare with Figma design side-by-side
   - Check dimensions, colors, shadows, typography

2. **Test the Animation:**
   - Click the logo to trigger the animation
   - Verify cards display correctly during animation
   - Check that images load properly
   - Ensure titles are readable

3. **Responsive Check:**
   - Test on different screen sizes
   - Verify card looks good at all animation scales
   - Check text doesn't overflow

### Troubleshooting Figma MCP

If Cursor can't access the Figma file:

1. **Check MCP Connection:**
   - Verify Figma MCP is enabled in Cursor settings
   - Ensure you have the latest version of Cursor

2. **Verify URL:**
   - Make sure the URL is complete and correct
   - The node-id parameter should be: `627-5284`

3. **Permissions:**
   - Ensure the Figma file is accessible (not private)
   - Check that MCP has proper authentication

4. **Fallback to Manual:**
   - If MCP fails, open Figma in browser
   - Use Dev Mode to manually copy specifications
   - Follow the manual implementation guide below

### Manual Fallback (If MCP Doesn't Work)

If Figma MCP is unavailable, follow these steps:

1. Open: https://www.figma.com/design/4Gybf22hipOI8rfPmLEgxs/App?node-id=627-5284&t=CKPNGDoYKJo5obPt-11
2. Click "Dev Mode" (top-right corner)
3. Select the anime card component (Node ID: 627-5284)
4. Copy all CSS specifications shown in the Inspect panel
5. Provide those specs to Cursor in this format:

```
Replace the AnimeCard placeholder with this Figma design:

Dimensions: [width]px x [height]px
Border Radius: [value]px
Shadow: [copy from Figma]
Border: [specs]
Background: [color/gradient]
Title Typography: [font, size, weight]
Title Position: [bottom, padding]
Title Overlay: [gradient specs]

Use these exact values to build the card.
```

---

## Step 6: (Optional) Create API Route for Client-Side Fetching

If you need client-side data fetching, create: `app/api/trending-anime/route.ts`

```typescript
// app/api/trending-anime/route.ts
import { NextResponse } from 'next/server';
import { getSeasonalTrendingAnime } from '@/lib/anilist';

export async function GET() {
  try {
    const anime = await getSeasonalTrendingAnime();
    return NextResponse.json(anime);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// Revalidate every hour
export const revalidate = 3600;
```

---

## Animation Behavior Explained

### Timeline:
```
0ms:        User clicks logo
0-500ms:    Logo bounces and rotates
300ms:      Cards start appearing from logo center
300-2800ms: Cards shoot out, rotate, scale up, then fade
3000ms:     Animation complete, ready for next click
```

### Card Positions:
```
        Card 3 (-120, -180)    Card 4 (120, -180)
                    ↖               ↗
                        [LOGO]
                    ↙               ↘
        Card 1 (-150, -80)      Card 2 (150, -80)
```

### Card Rotations:
- Card 1: -15° (tilted left)
- Card 2: +15° (tilted right)  
- Card 3: -25° (tilted more left)
- Card 4: +25° (tilted more right)

---

## Customization Options

### Change Animation Speed
```typescript
transition={{
  duration: 2.5, // Change this (in seconds)
  ease: [0.34, 1.56, 0.64, 1],
}}
```

### Change Card Positions
Edit the `getXPosition` and `getYPosition` functions to adjust where cards fly to.

### Change Card Size
```tsx
<div className="w-32 h-48"> // Change w-32 h-48 to different sizes
```

### Different Animation Styles

**Option A: Circular Orbit**
```typescript
function getXPosition(index: number): number {
  const radius = 150;
  const angle = (index / 4) * Math.PI * 2;
  return Math.cos(angle) * radius;
}

function getYPosition(index: number): number {
  const radius = 150;
  const angle = (index / 4) * Math.PI * 2;
  return Math.sin(angle) * radius;
}
```

**Option B: Vertical Stack**
```typescript
function getXPosition(index: number): number {
  return (index - 1.5) * 50; // Horizontal spread
}

function getYPosition(index: number): number {
  return -200; // All cards fly upward
}
```

---

## Performance Optimizations

1. **Image Preloading**: Images are loaded with `loading="eager"` for smooth animation
2. **API Caching**: AniList data cached for 1 hour via `next: { revalidate: 3600 }`
3. **Click Debouncing**: `isAnimating` state prevents spam clicks
4. **Error Handling**: Returns empty array on API failure, component handles gracefully

---

## Accessibility

- Logo button has `aria-label="Click for a surprise"`
- Images have proper alt text from anime titles
- Keyboard accessible (can tab to logo and press Enter)
- Respects `prefers-reduced-motion` if needed (add this if desired)

---

## Testing the Feature

1. Run your dev server: `npm run dev`
2. Click your logo - should bounce and shoot out 4 anime cards
3. Check browser console for any errors
4. Test on mobile (touch interaction)
5. Verify cards show actual seasonal trending anime from AniList

---

## Troubleshooting

### Cards don't appear:
- Check browser console for API errors
- Verify AniList API is accessible: https://graphql.anilist.co
- Check `trendingAnime` array has data

### Animation is janky:
- Ensure framer-motion is installed: `npm install framer-motion`
- Check for CSS conflicts (z-index, overflow hidden, etc.)
- Verify GPU acceleration is working (check Chrome DevTools Performance)

### Wrong season showing:
- Check `getCurrentSeason()` function logic
- Verify system date is correct
- AniList might not have data for current season (try previous season)

---

## Future Enhancements

### Add Sound Effect
```typescript
const playSound = () => {
  const audio = new Audio('/sounds/pop.mp3');
  audio.volume = 0.3;
  audio.play();
};

// In handleClick:
playSound();
```

### Add Confetti
```bash
npm install canvas-confetti
```

```typescript
import confetti from 'canvas-confetti';

const handleClick = () => {
  confetti({
    particleCount: 50,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#7C3AED', '#3B82F6'],
  });
  // ... rest
};
```

### Track Analytics
```typescript
useEffect(() => {
  if (clickCount === 1) {
    // Track first discovery
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'easter_egg_discovered', {
        event_category: 'engagement',
        event_label: 'logo_anime_cards',
      });
    }
  }
}, [clickCount]);
```

### Show Different Anime Each Click
```typescript
const [offset, setOffset] = useState(0);

// Fetch 12 anime instead of 4, cycle through them
const handleClick = () => {
  setOffset((prev) => (prev + 4) % 12);
  // Show anime.slice(offset, offset + 4)
};
```

---

## Mobile Considerations

The animation works on mobile, but you may want to adjust:

### Smaller Cards on Mobile
```tsx
<div className="w-24 h-36 md:w-32 md:h-48">
```

### Closer Positions on Mobile
```typescript
function getXPosition(index: number): number {
  const isMobile = window.innerWidth < 768;
  const positions = isMobile 
    ? [-100, 100, -80, 80]     // Closer for mobile
    : [-150, 150, -120, 120];  // Wider for desktop
  return positions[index] ?? 0;
}
```

### Disable on Very Small Screens
```tsx
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  setIsMobile(window.innerWidth < 640);
}, []);

// Don't render on very small screens
if (isMobile) return <>{children}</>;
```

---

## Complete File Structure

```
your-app/
├── app/
│   ├── api/
│   │   └── trending-anime/
│   │       └── route.ts          # Optional API route
│   └── page.tsx                   # Your main page
├── components/
│   ├── InteractiveLogo.tsx       # Main component (created above)
│   └── Header.tsx                 # Your header with logo
├── lib/
│   └── anilist.ts                # AniList API helper (created above)
└── package.json
```

---

## Summary

This easter egg:
✅ Fetches real seasonal trending anime from AniList
✅ Shows max 4 cards with cover images
✅ Animates smoothly with bouncy physics
✅ Prevents spam clicking
✅ Caches API calls to avoid rate limits
✅ Works on mobile and desktop
✅ Handles errors gracefully
✅ Accessible via keyboard
✅ Delightful surprise for users

The animation is playful, on-brand, and demonstrates your AniList integration beautifully. Anime fans will love discovering this! 🎉
