"use client";

import { useRef, useState, useEffect, useCallback, type CSSProperties } from "react";
import Image from "next/image";
import { useScroll, useMotionValueEvent, AnimatePresence, useReducedMotion } from "framer-motion";
import { motion, useAnimationControls } from "framer-motion";
import { Typography } from "@/components/ui";

const SEGMENT_COPY = [
  {
    title: "Your journey starts here",
    description:
      "Sign in with AniList and your whole library comes with you. No setup, no fuss.",
  },
  {
    title: "Everything at a glance",
    description:
      "See what's airing, how far behind you are, and what's next - all in one scroll.",
  },
  {
    title: "Update in a tap",
    description:
      "Track progress, switch status, or mark complete without leaving your flow.",
  },
  {
    title: "Never miss a drop",
    description:
      "A day-by-day view of every new episode. Just pick a day and hit play.",
  },
  {
    title: "Discover your next obsession",
    description:
      "Browse trending, popular, and top-rated picks. Your plan-to-watch list will thank you.",
  },
];

const THRESHOLDS = [0, 0.2, 0.4, 0.6, 0.8];
const HYSTERESIS = 0.03;

const FIGMA_BASE = {
  welcome: { width: 393, height: 852 },
  app: { width: 402, height: 874 },
} as const;

type FigmaRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const RECTS = {
  welcome: {
    background: { x: -1, y: 0, width: 394, height: 483 },
    copy: { x: 24, y: 549, width: 345, height: 122 },
    loginButton: { x: 32, y: 703, width: 329, height: 56 },
    signupLink: { x: 63, y: 791, width: 267, height: 16.5 },
    navBarTop: { x: 0, y: 0, width: 393, height: 98 },
    homeIndicator: { x: 0, y: 818, width: 393, height: 34 },
  },
  home: {
    copy: { x: 24, y: 106, width: 345, height: 112 },
    switch: { x: 24, y: 250, width: 823, height: 40 },
    cards: { x: 24, y: 314, width: 354, height: 578 },
    firstCard: { x: 24, y: 314, width: 171, height: 263 },
    navBarTop: { x: 0, y: 0, width: 402, height: 98 },
    bottomBar: { x: 0, y: 757, width: 402, height: 117 },
  },
  airing: {
    copy: { x: 24, y: 166, width: 345, height: 59 },
    dates: { x: 24, y: 78, width: 354, height: 68 },
    list: { x: 24, y: 257, width: 355, height: 346 },
    navBarTop: { x: 0, y: 0, width: 402, height: 98 },
    bottomBar: { x: 0, y: 757, width: 402, height: 117 },
    thirdIcon: { x: 186, y: 803, width: 80, height: 54 },
  },
  explore: {
    navBarTop: { x: 0, y: 0, width: 402, height: 98 },
    search: { x: 24, y: 728, width: 354, height: 48 },
    popular: { x: 24, y: 130, width: 638, height: 242 },
    trending: { x: 24, y: 434, width: 476, height: 158 },
    upcoming: { x: 24, y: 656, width: 476, height: 161 },
    bottomBar: { x: 0, y: 757, width: 402, height: 117 },
  },
} as const;

const SLICES = {
  welcome: {
    background: "/screens/slices/welcome-background.png",
    copy: "/screens/slices/welcome-copy.png",
    loginButton: "/screens/slices/welcome-loginButton.png",
    signupLink: "/screens/slices/welcome-signupLink.png",
    navBarTop: "/screens/slices/welcome-navBarTop.png",
    homeIndicator: "/screens/slices/welcome-homeIndicator.png",
  },
  home: {
    copy: "/screens/slices/home-copy.png",
    switch: "/screens/slices/home-switch.png",
    cards: "/screens/slices/home-cards.png",
    firstCard: "/screens/slices/home-firstCard.png",
    navBarTop: "/screens/slices/home-navBarTop.png",
    bottomBar: "/screens/slices/home-bottomBar.png",
  },
  airing: {
    copy: "/screens/slices/airing-copy.png",
    dates: "/screens/slices/airing-dates.png",
    list: "/screens/slices/airing-list.png",
    navBarTop: "/screens/slices/airing-navBarTop.png",
    bottomBar: "/screens/slices/airing-bottomBar.png",
  },
  explore: {
    navBarTop: "/screens/slices/explore-navBarTop.png",
    search: "/screens/slices/explore-search.png",
    trending: "/screens/slices/explore-trending.png",
    upcoming: "/screens/slices/explore-upcoming.png",
    popular: "/screens/slices/explore-popular.png",
    bottomBar: "/screens/slices/explore-bottomBar.png",
  },
  drawer: "/screens/screen-actions.png",
} as const;

function getSegment(progress: number, previousSegment: number): number {
  let segment = 0;
  for (let i = THRESHOLDS.length - 1; i >= 0; i--) {
    if (progress >= THRESHOLDS[i]) {
      segment = i;
      break;
    }
  }
  if (segment < previousSegment && progress < THRESHOLDS[previousSegment] - HYSTERESIS) {
    return segment;
  }
  if (segment > previousSegment && progress >= THRESHOLDS[segment] - HYSTERESIS) {
    return segment;
  }
  return previousSegment;
}

const tapPulseAnimation = {
  scale: [1, 0.92, 1.03, 1] as number[],
  transition: { duration: 0.26, ease: [0.22, 0.61, 0.36, 1] as const },
};

const segmentTransitionIn = { duration: 0.32, ease: [0, 0, 0.2, 1] as const };
const drawerSpring = { type: "spring" as const, stiffness: 340, damping: 32 };
const actorEnter = { duration: 0.34, ease: [0.22, 0.61, 0.36, 1] as const };

function rectToStyle(rect: FigmaRect, frame: { width: number; height: number }) {
  return {
    left: `${(rect.x / frame.width) * 100}%`,
    top: `${(rect.y / frame.height) * 100}%`,
    width: `${(rect.width / frame.width) * 100}%`,
    height: `${(rect.height / frame.height) * 100}%`,
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function StageGradient() {
  return (
    <div
      className="absolute inset-0"
      style={{ background: "linear-gradient(180deg, #10141B 0%, #010102 100%)" }}
      aria-hidden
    />
  );
}

function Slice({ src, style, alt }: { src: string; style: CSSProperties; alt: string }) {
  return (
    <div className="absolute" style={style}>
      <Image src={src} alt={alt} fill className="object-contain" sizes="(max-width: 1024px) 280px, 320px" />
    </div>
  );
}

const instantTransition = { duration: 0 } as const;

export function FeatureShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const previousSegmentRef = useRef(0);
  const lastPlayedSegmentRef = useRef(-1);
  const playSequenceRef = useRef(0);
  const hasTriggeredFirstScrollRef = useRef(false);
  const firstScrollTransitionTimeoutRef = useRef<number | null>(null);
  const [drawerGone, setDrawerGone] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  const welcomeButtonControls = useAnimationControls();
  const homeCopyControls = useAnimationControls();
  const homeSwitchControls = useAnimationControls();
  const homeCardsControls = useAnimationControls();
  const homeBottomBarControls = useAnimationControls();
  const homeFirstCardTapControls = useAnimationControls();
  const drawerPanelControls = useAnimationControls();
  const airingDateControls = useAnimationControls();
  const airingCopyControls = useAnimationControls();
  const airingListControls = useAnimationControls();
  const airingBottomBarControls = useAnimationControls();
  const airingThirdIconControls = useAnimationControls();
  const exploreSearchControls = useAnimationControls();
  const exploreTrendingControls = useAnimationControls();
  const exploreUpcomingControls = useAnimationControls();
  const explorePopularControls = useAnimationControls();
  const exploreBottomBarControls = useAnimationControls();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const playSegment = useCallback(
    async (index: number) => {
      playSequenceRef.current += 1;
      const sequence = playSequenceRef.current;
      const isCurrent = () => playSequenceRef.current === sequence;
      const enterTransition = prefersReducedMotion ? instantTransition : actorEnter;
      const springTransition = prefersReducedMotion ? instantTransition : drawerSpring;

      if (index === 0) {
        welcomeButtonControls.set({ scale: 1 });
        lastPlayedSegmentRef.current = 0;
      } else if (index === 1) {
        homeCopyControls.set({ opacity: 0, y: 16 });
        homeSwitchControls.set({ opacity: 0, y: 20 });
        homeCardsControls.set({ opacity: 0, x: 20 });
        homeBottomBarControls.set({ opacity: 0, y: 18 });
        homeFirstCardTapControls.set({ scale: 1 });

        void homeCopyControls.start({ opacity: 1, y: 0, transition: enterTransition });
        await sleep(prefersReducedMotion ? 0 : 70);
        if (!isCurrent()) return;
        void homeSwitchControls.start({ opacity: 1, y: 0, transition: enterTransition });
        await sleep(prefersReducedMotion ? 0 : 70);
        if (!isCurrent()) return;
        void homeCardsControls.start({ opacity: 1, x: 0, transition: enterTransition });
        await sleep(prefersReducedMotion ? 0 : 90);
        if (!isCurrent()) return;
        void homeBottomBarControls.start({ opacity: 1, y: 0, transition: enterTransition });
        await sleep(prefersReducedMotion ? 0 : 170);
        if (!isCurrent()) return;
        if (!prefersReducedMotion) void homeFirstCardTapControls.start(tapPulseAnimation);
        lastPlayedSegmentRef.current = 1;
      } else if (index === 2) {
        setDrawerGone(false);
        drawerPanelControls.set({ y: "100%" });
        void drawerPanelControls.start({ y: 0, transition: springTransition });
        lastPlayedSegmentRef.current = 2;
      } else if (index === 3) {
        void drawerPanelControls.start({ y: "100%", transition: springTransition }).then(() => {
          if (isCurrent()) {
            setTimeout(() => setDrawerGone(true), prefersReducedMotion ? 0 : 80);
          }
        });

        airingDateControls.set({ opacity: 0, y: -18 });
        airingCopyControls.set({ opacity: 0, y: 14 });
        airingListControls.set({ opacity: 0, x: 28 });
        airingBottomBarControls.set({ opacity: 0, y: 16 });
        airingThirdIconControls.set({ scale: 1 });

        void airingDateControls.start({ opacity: 1, y: 0, transition: enterTransition });
        await sleep(prefersReducedMotion ? 0 : 60);
        if (!isCurrent()) return;
        void airingCopyControls.start({ opacity: 1, y: 0, transition: enterTransition });
        await sleep(prefersReducedMotion ? 0 : 70);
        if (!isCurrent()) return;
        void airingListControls.start({ opacity: 1, x: 0, transition: enterTransition });
        await sleep(prefersReducedMotion ? 0 : 80);
        if (!isCurrent()) return;
        void airingBottomBarControls.start({ opacity: 1, y: 0, transition: enterTransition });
        await sleep(prefersReducedMotion ? 0 : 140);
        if (!isCurrent()) return;
        if (!prefersReducedMotion) void airingThirdIconControls.start(tapPulseAnimation);
        lastPlayedSegmentRef.current = 3;
      } else if (index === 4) {
        exploreSearchControls.set({ opacity: 0, y: -14 });
        exploreBottomBarControls.set({ opacity: 0, y: 14 });
        exploreTrendingControls.set({ opacity: 0, x: 24 });
        exploreUpcomingControls.set({ opacity: 0, x: 24 });
        explorePopularControls.set({ opacity: 0, x: 24 });

        void exploreSearchControls.start({ opacity: 1, y: 0, transition: enterTransition });
        void exploreBottomBarControls.start({ opacity: 1, y: 0, transition: enterTransition });
        await sleep(prefersReducedMotion ? 0 : 80);
        if (!isCurrent()) return;
        void explorePopularControls.start({ opacity: 1, x: 0, transition: enterTransition });
        await sleep(prefersReducedMotion ? 0 : 80);
        if (!isCurrent()) return;
        void exploreTrendingControls.start({ opacity: 1, x: 0, transition: enterTransition });
        await sleep(prefersReducedMotion ? 0 : 80);
        if (!isCurrent()) return;
        void exploreUpcomingControls.start({ opacity: 1, x: 0, transition: enterTransition });
        lastPlayedSegmentRef.current = 4;
      }
    },
    [
      prefersReducedMotion,
      welcomeButtonControls,
      homeCopyControls,
      homeSwitchControls,
      homeCardsControls,
      homeBottomBarControls,
      homeFirstCardTapControls,
      drawerPanelControls,
      airingDateControls,
      airingCopyControls,
      airingListControls,
      airingBottomBarControls,
      airingThirdIconControls,
      exploreSearchControls,
      exploreTrendingControls,
      exploreUpcomingControls,
      explorePopularControls,
      exploreBottomBarControls,
    ]
  );

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const prev = previousSegmentRef.current;

    if (!hasTriggeredFirstScrollRef.current && prev === 0 && v > 0.0005) {
      hasTriggeredFirstScrollRef.current = true;
      if (!prefersReducedMotion) {
        void welcomeButtonControls.start(tapPulseAnimation);
      }

      if (firstScrollTransitionTimeoutRef.current !== null) {
        window.clearTimeout(firstScrollTransitionTimeoutRef.current);
      }
      firstScrollTransitionTimeoutRef.current = window.setTimeout(() => {
        previousSegmentRef.current = 1;
        setSegmentIndex(1);
        if (lastPlayedSegmentRef.current !== 1) {
          void playSegment(1);
        }
      }, 180);
      return;
    }

    const effectiveProgress =
      hasTriggeredFirstScrollRef.current && v > 0 ? Math.max(v, THRESHOLDS[1]) : v;
    const next = getSegment(effectiveProgress, prev);
    if (next !== prev) {
      previousSegmentRef.current = next;
      setSegmentIndex(next);
      if (next !== lastPlayedSegmentRef.current) {
        void playSegment(next);
      }
    }
  });

  useEffect(() => {
    const initialSegment = getSegment(0, 0);
    previousSegmentRef.current = initialSegment;
    setSegmentIndex(initialSegment);
    if (initialSegment !== lastPlayedSegmentRef.current) {
      lastPlayedSegmentRef.current = initialSegment - 1;
      void playSegment(initialSegment);
    }
    return () => {
      if (firstScrollTransitionTimeoutRef.current !== null) {
        window.clearTimeout(firstScrollTransitionTimeoutRef.current);
      }
    };
  }, [playSegment]);

  const showDrawer = segmentIndex === 2 || (segmentIndex === 3 && !drawerGone);

  return (
    <section ref={containerRef} className="relative" style={{ height: "900vh" }}>
      <div className="sticky top-0 h-screen flex flex-col lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center justify-center px-6 py-16 lg:py-0 max-w-6xl mx-auto">
        <div className="flex flex-col justify-center text-center lg:text-left mb-8 lg:mb-0 min-h-[180px] lg:min-h-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={segmentIndex}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -16 }}
              transition={prefersReducedMotion ? instantTransition : { duration: 0.3, ease: "easeOut" }}
              className="space-y-4"
            >
              <Typography variant="h2" className="text-text-primary">
                {SEGMENT_COPY[segmentIndex].title}
              </Typography>
              <Typography variant="body" className="text-text-secondary max-w-lg mx-auto lg:mx-0">
                {SEGMENT_COPY[segmentIndex].description}
              </Typography>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center gap-8">
          <div
            className="relative w-[280px] lg:w-[320px] shrink-0 rounded-[3rem] border border-border-default bg-bg-surface overflow-hidden shadow-xl"
            style={{ aspectRatio: "393/852" }}
          >
            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: segmentIndex === 0 ? 1 : 0, pointerEvents: segmentIndex === 0 ? "auto" : "none" }}
              transition={prefersReducedMotion ? instantTransition : segmentTransitionIn}
            >
              <StageGradient />
              <Slice src={SLICES.welcome.background} alt="Welcome background" style={rectToStyle(RECTS.welcome.background, FIGMA_BASE.welcome)} />
              <Slice src={SLICES.welcome.copy} alt="Welcome copy" style={rectToStyle(RECTS.welcome.copy, FIGMA_BASE.welcome)} />
              <Slice src={SLICES.welcome.signupLink} alt="Welcome signup" style={rectToStyle(RECTS.welcome.signupLink, FIGMA_BASE.welcome)} />
              <Slice src={SLICES.welcome.navBarTop} alt="Welcome navbar" style={rectToStyle(RECTS.welcome.navBarTop, FIGMA_BASE.welcome)} />
              <Slice src={SLICES.welcome.homeIndicator} alt="Welcome indicator" style={rectToStyle(RECTS.welcome.homeIndicator, FIGMA_BASE.welcome)} />
              <motion.div
                className="absolute"
                animate={welcomeButtonControls}
                transition={tapPulseAnimation.transition}
                style={rectToStyle(RECTS.welcome.loginButton, FIGMA_BASE.welcome)}
              >
                <Image src={SLICES.welcome.loginButton} alt="Login with AniList" fill className="object-contain" sizes="(max-width: 1024px) 280px, 320px" />
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: segmentIndex === 1 || segmentIndex === 2 ? 1 : 0, pointerEvents: segmentIndex === 1 || segmentIndex === 2 ? "auto" : "none" }}
              transition={prefersReducedMotion ? instantTransition : segmentTransitionIn}
            >
              <StageGradient />
              <Slice src={SLICES.home.navBarTop} alt="Home navbar" style={rectToStyle(RECTS.home.navBarTop, FIGMA_BASE.app)} />
              <motion.div animate={homeCopyControls} transition={actorEnter} className="absolute" style={rectToStyle(RECTS.home.copy, FIGMA_BASE.app)}>
                <Image src={SLICES.home.copy} alt="Home copy" fill className="object-contain" sizes="(max-width: 1024px) 280px, 320px" />
              </motion.div>
              <motion.div animate={homeSwitchControls} transition={actorEnter} className="absolute" style={rectToStyle(RECTS.home.switch, FIGMA_BASE.app)}>
                <Image src={SLICES.home.switch} alt="Home switch" fill className="object-contain" sizes="(max-width: 1024px) 280px, 320px" />
              </motion.div>
              <motion.div animate={homeCardsControls} transition={actorEnter} className="absolute" style={rectToStyle(RECTS.home.cards, FIGMA_BASE.app)}>
                <Image src={SLICES.home.cards} alt="Home cards" fill className="object-contain" sizes="(max-width: 1024px) 280px, 320px" />
              </motion.div>
              <motion.div animate={homeBottomBarControls} transition={actorEnter} className="absolute" style={rectToStyle(RECTS.home.bottomBar, FIGMA_BASE.app)}>
                <Image src={SLICES.home.bottomBar} alt="Home bottom bar" fill className="object-contain" sizes="(max-width: 1024px) 280px, 320px" />
              </motion.div>
              <motion.div
                className="absolute"
                style={rectToStyle(RECTS.home.firstCard, FIGMA_BASE.app)}
                animate={homeFirstCardTapControls}
                transition={tapPulseAnimation.transition}
              >
                <Image src={SLICES.home.firstCard} alt="Home first card" fill className="object-contain" sizes="(max-width: 1024px) 280px, 320px" />
              </motion.div>
            </motion.div>

            {showDrawer && (
              <motion.div className="absolute inset-0 z-10" initial={{ y: "100%" }} animate={drawerPanelControls} transition={drawerSpring}>
                <Image src={SLICES.drawer} alt="Action drawer" fill className="object-cover object-bottom" sizes="(max-width: 1024px) 280px, 320px" />
              </motion.div>
            )}

            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: segmentIndex === 3 ? 1 : 0, pointerEvents: segmentIndex === 3 ? "auto" : "none" }}
              transition={prefersReducedMotion ? instantTransition : segmentTransitionIn}
            >
              <StageGradient />
              <Slice src={SLICES.airing.navBarTop} alt="Airing navbar" style={rectToStyle(RECTS.airing.navBarTop, FIGMA_BASE.app)} />
              <motion.div animate={airingDateControls} transition={actorEnter} className="absolute" style={rectToStyle(RECTS.airing.dates, FIGMA_BASE.app)}>
                <Image src={SLICES.airing.dates} alt="Airing dates" fill className="object-contain" sizes="(max-width: 1024px) 280px, 320px" />
              </motion.div>
              <motion.div animate={airingCopyControls} transition={actorEnter} className="absolute" style={rectToStyle(RECTS.airing.copy, FIGMA_BASE.app)}>
                <Image src={SLICES.airing.copy} alt="Airing copy" fill className="object-contain" sizes="(max-width: 1024px) 280px, 320px" />
              </motion.div>
              <motion.div animate={airingListControls} transition={actorEnter} className="absolute" style={rectToStyle(RECTS.airing.list, FIGMA_BASE.app)}>
                <Image src={SLICES.airing.list} alt="Airing list" fill className="object-contain" sizes="(max-width: 1024px) 280px, 320px" />
              </motion.div>
              <motion.div animate={airingBottomBarControls} transition={actorEnter} className="absolute" style={rectToStyle(RECTS.airing.bottomBar, FIGMA_BASE.app)}>
                <motion.div animate={airingThirdIconControls} transition={tapPulseAnimation.transition} className="absolute inset-0" style={{ transformOrigin: "56% 58%" }}>
                  <Image src={SLICES.airing.bottomBar} alt="Airing bottom bar" fill className="object-contain" sizes="(max-width: 1024px) 280px, 320px" />
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: segmentIndex === 4 ? 1 : 0, pointerEvents: segmentIndex === 4 ? "auto" : "none" }}
              transition={prefersReducedMotion ? instantTransition : segmentTransitionIn}
            >
              <StageGradient />
              <Slice src={SLICES.explore.navBarTop} alt="Explore navbar" style={rectToStyle(RECTS.explore.navBarTop, FIGMA_BASE.app)} />
              <motion.div animate={exploreSearchControls} transition={actorEnter} className="absolute" style={rectToStyle(RECTS.explore.search, FIGMA_BASE.app)}>
                <Image src={SLICES.explore.search} alt="Explore search" fill className="object-contain" sizes="(max-width: 1024px) 280px, 320px" />
              </motion.div>
              <motion.div animate={exploreTrendingControls} transition={actorEnter} className="absolute" style={rectToStyle(RECTS.explore.trending, FIGMA_BASE.app)}>
                <Image src={SLICES.explore.trending} alt="Explore trending" fill className="object-contain" sizes="(max-width: 1024px) 280px, 320px" />
              </motion.div>
              <motion.div animate={exploreUpcomingControls} transition={actorEnter} className="absolute" style={rectToStyle(RECTS.explore.upcoming, FIGMA_BASE.app)}>
                <Image src={SLICES.explore.upcoming} alt="Explore upcoming" fill className="object-contain" sizes="(max-width: 1024px) 280px, 320px" />
              </motion.div>
              <motion.div animate={explorePopularControls} transition={actorEnter} className="absolute" style={rectToStyle(RECTS.explore.popular, FIGMA_BASE.app)}>
                <Image src={SLICES.explore.popular} alt="Explore popular" fill className="object-contain" sizes="(max-width: 1024px) 280px, 320px" />
              </motion.div>
              <motion.div animate={exploreBottomBarControls} transition={actorEnter} className="absolute" style={rectToStyle(RECTS.explore.bottomBar, FIGMA_BASE.app)}>
                <Image src={SLICES.explore.bottomBar} alt="Explore bottom bar" fill className="object-contain" sizes="(max-width: 1024px) 280px, 320px" />
              </motion.div>
            </motion.div>
          </div>

          <div className="flex flex-col gap-2" aria-hidden>
            {SEGMENT_COPY.map((_, i) => (
              <motion.div
                key={i}
                className="h-2 w-2 rounded-full border border-border-default"
                style={{ backgroundColor: segmentIndex === i ? "var(--color-accent-blue)" : "transparent" }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
