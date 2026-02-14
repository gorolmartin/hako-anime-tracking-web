"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  useScroll,
  AnimatePresence,
  motion,
  animate,
  useReducedMotion,
} from "framer-motion";

/* ── Video stop points (seconds) for each screen ── */
const VIDEO_STOPS = [1.3, 3.65, 5.2, 7.4, 9.4];

/* ── Scroll snap points (scrollYProgress 0-1) to advance page position ── */
const SCROLL_SNAPS = [0, 0.26, 0.46, 0.66, 0.90];

/* ── Feature text per screen ── */
const FEATURE_TEXT = [
  {
    tag: "Welcome",
    title: "Your Anime Life, Organized",
    description:
      "Sign in with AniList and your entire watchlist syncs instantly. Pick up right where you left off.",
  },
  {
    tag: "Home",
    title: "Everything at a Glance",
    description:
      "See new episodes, track your progress, and manage your watchlist from a single, beautiful home screen.",
  },
  {
    tag: "Quick Actions",
    title: "Update in a Tap",
    description:
      "Log episodes, change status, and organize your list without breaking your flow. Quick, effortless, done.",
  },
  {
    tag: "Schedule",
    title: "Never Miss a Drop",
    description:
      "A weekly airing calendar shows exactly when your shows release. Stay ahead, not behind.",
  },
  {
    tag: "Discover",
    title: "Find Your Next Obsession",
    description:
      "Browse seasonal hits, trending titles, and upcoming releases. Your next favorite anime is one scroll away.",
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeScreen, setActiveScreen] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  /* ── Snap-scroll state ── */
  const currentSnap = useRef(0);
  const isAnimating = useRef(false);
  const scrollAnimRef = useRef<ReturnType<typeof animate> | null>(null);
  const touchStartY = useRef<number | null>(null);
  const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoListenerRef = useRef<(() => void) | null>(null);
  const videoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* ── webkit-playsinline for older iOS Safari ── */
  useEffect(() => {
    const video = videoRef.current;
    if (video) video.setAttribute("webkit-playsinline", "true");
  }, []);

  /* ── Convert scrollYProgress → absolute window.scrollY ── */
  const progressToScrollY = useCallback((progress: number) => {
    const section = sectionRef.current;
    if (!section) return 0;
    const sectionTop = section.offsetTop;
    const scrollRange = section.offsetHeight - window.innerHeight;
    return sectionTop + progress * scrollRange;
  }, []);

  /* ── Play video forward to a stop point ── */
  const playVideoTo = useCallback((targetIndex: number) => {
    const video = videoRef.current;
    if (!video) {
      isAnimating.current = false;
      return;
    }

    /* Clean up previous listener/timeout */
    if (videoListenerRef.current) {
      video.removeEventListener("timeupdate", videoListenerRef.current);
      videoListenerRef.current = null;
    }
    if (videoTimeoutRef.current) {
      clearTimeout(videoTimeoutRef.current);
      videoTimeoutRef.current = null;
    }

    const stopTime = VIDEO_STOPS[targetIndex];

    const onTimeUpdate = () => {
      if (video.currentTime >= stopTime) {
        clearTimeout(videoTimeoutRef.current!);
        videoTimeoutRef.current = null;
        video.pause();
        video.removeEventListener("timeupdate", onTimeUpdate);
        videoListenerRef.current = null;
        isAnimating.current = false;
      }
    };

    const timeout = setTimeout(() => {
      video.pause();
      video.currentTime = stopTime;
      video.removeEventListener("timeupdate", onTimeUpdate);
      videoListenerRef.current = null;
      videoTimeoutRef.current = null;
      isAnimating.current = false;
    }, 8000);

    videoListenerRef.current = onTimeUpdate;
    videoTimeoutRef.current = timeout;

    video.addEventListener("timeupdate", onTimeUpdate);
    video.play().catch(() => {
      clearTimeout(timeout);
      video.removeEventListener("timeupdate", onTimeUpdate);
      videoListenerRef.current = null;
      videoTimeoutRef.current = null;
      video.currentTime = stopTime;
      isAnimating.current = false;
    });
  }, []);

  /* ── Snap to a screen index ── */
  const snapTo = useCallback(
    (targetIndex: number, direction: 1 | -1) => {
      if (targetIndex < 0 || targetIndex > 4) return;

      isAnimating.current = true;
      currentSnap.current = targetIndex;
      setActiveScreen(targetIndex);

      /* Safety: force unlock if something fails */
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = setTimeout(() => {
        isAnimating.current = false;
        safetyTimeoutRef.current = null;
      }, 10000);

      /* Cancel any in-flight scroll animation */
      if (scrollAnimRef.current) {
        scrollAnimRef.current.stop();
      }

      /* Animate page scroll to keep position advancing through section */
      const fromScroll = window.scrollY;
      const toScroll = progressToScrollY(SCROLL_SNAPS[targetIndex]);

      scrollAnimRef.current = animate(fromScroll, toScroll, {
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: [0.32, 0.72, 0, 1],
        onUpdate: (v) => window.scrollTo(0, v),
        onComplete: () => {
          scrollAnimRef.current = null;
        },
      });

      /* Play or seek the video */
      const video = videoRef.current;
      if (!video) {
        isAnimating.current = false;
        return;
      }

      if (direction === 1 && !prefersReducedMotion) {
        /* Forward: play from current time to stop point */
        playVideoTo(targetIndex);
      } else {
        /* Backward or reduced motion: instantly seek to the stop point */
        video.pause();
        video.currentTime = VIDEO_STOPS[targetIndex];
        isAnimating.current = false;
      }
    },
    [progressToScrollY, playVideoTo, prefersReducedMotion],
  );

  /* ── Initial entry: when section first scrolls into view, play to screen 0 ── */
  const hasEnteredRef = useRef(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      if (v > 0 && v < 1 && !hasEnteredRef.current) {
        hasEnteredRef.current = true;

        const video = videoRef.current;
        if (video && video.currentTime === 0) {
          /* Snap scroll to first rest zone and play video to first stop */
          isAnimating.current = true;
          currentSnap.current = 0;
          setActiveScreen(0);

          const fromScroll = window.scrollY;
          const toScroll = progressToScrollY(SCROLL_SNAPS[0]);

          scrollAnimRef.current = animate(fromScroll, toScroll, {
            duration: prefersReducedMotion ? 0 : 0.6,
            ease: [0.32, 0.72, 0, 1],
            onUpdate: (val) => window.scrollTo(0, val),
            onComplete: () => {
              scrollAnimRef.current = null;
            },
          });

          /* Always seek on entry (play may be blocked on mobile) */
          video.currentTime = VIDEO_STOPS[0];
          isAnimating.current = false;
        }
      }

      /* Reset state when leaving section (scroll back up) */
      if (v <= 0) {
        hasEnteredRef.current = false;
        currentSnap.current = 0;
        setActiveScreen(0);
        isAnimating.current = false;
        if (scrollAnimRef.current) {
          scrollAnimRef.current.stop();
          scrollAnimRef.current = null;
        }
      }

      /* Reset when scrolling past section */
      if (v >= 1) {
        currentSnap.current = 4;
        setActiveScreen(4);
        isAnimating.current = false;
        if (scrollAnimRef.current) {
          scrollAnimRef.current.stop();
          scrollAnimRef.current = null;
        }
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, progressToScrollY, playVideoTo, prefersReducedMotion]);

  /* ── Wheel handler ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleWheel = (e: WheelEvent) => {
      const progress = scrollYProgress.get();

      /* Outside the section → let page scroll normally */
      if (progress <= 0 || progress >= 1) return;

      /* Block input while animating */
      if (isAnimating.current) {
        e.preventDefault();
        return;
      }

      const direction = e.deltaY > 0 ? 1 : -1;
      const nextSnap = currentSnap.current + direction;

      /* Boundary: let page scroll past the section */
      if (nextSnap < 0 || nextSnap > 4) return;

      /* With reduced motion, allow normal scroll instead of snap */
      if (prefersReducedMotion) return;

      e.preventDefault();
      snapTo(nextSnap, direction as 1 | -1);
    };

    section.addEventListener("wheel", handleWheel, { passive: false });
    return () => section.removeEventListener("wheel", handleWheel);
  }, [scrollYProgress, snapTo, prefersReducedMotion]);

  /* ── Touch swipe handler (mobile) ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const progress = scrollYProgress.get();

      /* Outside section → let native scroll work */
      if (progress <= 0 || progress >= 1) return;

      /* Gesture already consumed → block drift */
      if (touchStartY.current === null) {
        e.preventDefault();
        return;
      }

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY.current - currentY;
      const direction = deltaY > 0 ? 1 : -1;
      const nextSnap = currentSnap.current + direction;

      /* At boundary → let native scroll pass so user can leave */
      if (nextSnap < 0 || nextSnap > 4) return;

      /* Inside section → block native scroll */
      e.preventDefault();

      if (isAnimating.current) return;
      if (prefersReducedMotion) return;
      if (Math.abs(deltaY) < 50) return;

      touchStartY.current = null;
      snapTo(nextSnap, direction as 1 | -1);
    };

    const handleTouchEnd = () => {
      touchStartY.current = null;
    };

    section.addEventListener("touchstart", handleTouchStart, { passive: true });
    section.addEventListener("touchmove", handleTouchMove, { passive: false });
    section.addEventListener("touchend", handleTouchEnd, { passive: true });
    section.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    return () => {
      section.removeEventListener("touchstart", handleTouchStart);
      section.removeEventListener("touchmove", handleTouchMove);
      section.removeEventListener("touchend", handleTouchEnd);
      section.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [scrollYProgress, snapTo, prefersReducedMotion]);

  const current = FEATURE_TEXT[activeScreen];

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: "500vh" }}
    >
      <div className="sticky top-0 h-screen flex flex-col gap-8 md:grid md:grid-cols-2 md:gap-12 lg:gap-16 items-center justify-center px-6 max-w-6xl mx-auto">
        {/* ── Left: Feature text ── */}
        <div className="flex flex-col justify-center text-center md:text-left min-h-0 md:pl-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeScreen}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -20 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: "easeOut" }}
              className="space-y-4"
            >
              <span className="hidden md:inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full bg-accent-blue-muted text-accent-blue-text">
                {current.tag}
              </span>
              <h2 className="text-3xl md:text-4xl font-medium leading-tight tracking-h2 text-text-primary">
                {current.title}
              </h2>
              <p className="hidden md:block text-base leading-relaxed max-w-md mx-auto md:mx-0 text-text-secondary">
                {current.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Section indicator dots */}
          <div className="flex items-center justify-center md:justify-start gap-2 mt-6">
            {[0, 1, 2, 3, 4].map((index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to ${FEATURE_TEXT[index].tag}`}
                onClick={() => {
                  const direction = index > currentSnap.current ? 1 : -1;
                  snapTo(index, direction as 1 | -1);
                }}
                className={`rounded-full w-1.5 h-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg-app ${activeScreen === index ? "bg-accent-blue" : "bg-blue-950"}`}
              />
            ))}
          </div>
        </div>

        {/* ── Right: Rounded video container ── */}
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
            className="relative mx-auto overflow-hidden min-w-0"
            style={{
              height: "min(70vh, 90vh)",
              width: "calc(min(70vh, 90vh) * 9 / 19.5)",
              maxWidth: "100%",
              aspectRatio: "9 / 19.5",
              borderRadius: 32,
              border: "2px solid #1B1F28",
              transform: "translateZ(0)",
            }}
          >
            <video
              ref={videoRef}
              src="/features/hako.mp4"
              muted
              playsInline
              preload="auto"
              aria-label="App preview video showing Hako features"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ transform: "translateZ(0)" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
