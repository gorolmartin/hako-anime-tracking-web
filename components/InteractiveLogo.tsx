"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TrendingAnime } from "@/lib/anilist";

interface InteractiveLogoProps {
  children: React.ReactNode;
}

export function InteractiveLogo({ children }: InteractiveLogoProps) {
  const [trendingAnime, setTrendingAnime] = useState<TrendingAnime[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    fetch("/api/trending-anime")
      .then((res) => res.json())
      .then((data: TrendingAnime[]) => {
        setTrendingAnime(data);
        // Preload cover images into browser cache so they're ready on click
        data.forEach((anime) => {
          const img = new Image();
          img.src = anime.coverImage.extraLarge || anime.coverImage.large;
        });
      })
      .catch((err) => console.error("Failed to load trending anime:", err));
  }, []);

  const handleClick = () => {
    if (isAnimating || trendingAnime.length === 0) return;

    setIsAnimating(true);
    setClickCount((prev) => prev + 1);

    setTimeout(() => {
      setShowCards(true);
    }, 300);

    setTimeout(() => {
      setShowCards(false);
      setIsAnimating(false);
    }, 3000);
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Interactive Logo with Bounce Animation */}
      <motion.button
        onClick={handleClick}
        className="cursor-pointer focus:outline-none relative z-10"
        animate={
          isAnimating
            ? {
                scale: [1, 1.2, 0.9, 1.1, 1],
                rotate: [0, -10, 10, -5, 0],
              }
            : {}
        }
        transition={{
          duration: 0.5,
          ease: [0.34, 1.56, 0.64, 1],
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Click for a surprise"
      >
        {children}
      </motion.button>

      {/* Easter Egg Hint */}
      {clickCount === 0 && trendingAnime.length > 0 && (
        <motion.div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-text-tertiary whitespace-nowrap pointer-events-none"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          psst, click me
        </motion.div>
      )}

      {/* Anime Cards Container */}
      <div className="absolute top-1/2 left-1/2 pointer-events-none z-0">
        <AnimatePresence>
          {showCards &&
            trendingAnime.map((anime, index) => (
              <AnimeCard key={anime.id} anime={anime} index={index} />
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Card position helpers ── */

function getXPosition(index: number): number {
  const positions = [-150, 150, -120, 120];
  return positions[index] ?? 0;
}

function getYPosition(index: number): number {
  const positions = [-80, -80, -180, -180];
  return positions[index] ?? 0;
}

function getRotation(index: number): number {
  const rotations = [-15, 15, -25, 25];
  return rotations[index] ?? 0;
}

/* ── Anime Card (Figma design: 627:5284) ── */

function AnimeCard({
  anime,
  index,
}: {
  anime: TrendingAnime;
  index: number;
}) {
  return (
    <motion.div
      className="absolute top-0 left-0"
      style={{ left: -50, top: 0, willChange: "transform, opacity" }}
      initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }}
      animate={{
        x: getXPosition(index),
        y: getYPosition(index),
        scale: 1,
        opacity: [0, 1, 1, 1, 0],
        rotate: getRotation(index),
      }}
      transition={{
        x: { type: "spring", stiffness: 200, damping: 14, delay: index * 0.06 },
        y: { type: "spring", stiffness: 200, damping: 14, delay: index * 0.06 },
        scale: { type: "spring", stiffness: 200, damping: 14, delay: index * 0.06 },
        rotate: { type: "spring", stiffness: 200, damping: 14, delay: index * 0.06 },
        opacity: { duration: 2.5, times: [0, 0.15, 0.5, 0.85, 1], delay: index * 0.06 },
      }}
      exit={{
        x: 0,
        y: 0,
        scale: 0,
        opacity: 0,
        transition: { duration: 0.3, ease: "easeIn" },
      }}
    >
      {/* Card container — 100×140, 8px radius */}
      <div
        className="relative overflow-hidden"
        style={{
          width: 100,
          height: 140,
          borderRadius: 8,
          transform: "translateZ(0)",
        }}
      >
        {/* Cover image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={anime.coverImage.extraLarge || anime.coverImage.large}
          alt={anime.title.english || anime.title.romaji}
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ borderRadius: 8 }}
        />

        {/* Progressive blur — 4 strips with increasing filter:blur on image copies */}
        {[
          { top: 83, height: 14, blur: 2 },
          { top: 97, height: 14, blur: 5 },
          { top: 111, height: 14, blur: 8 },
          { top: 125, height: 15, blur: 10 },
        ].map((strip, i) => (
          <div
            key={i}
            className="absolute overflow-hidden"
            style={{
              left: 0,
              top: strip.top,
              width: 100,
              height: strip.height,
              borderRadius: i === 3 ? "0 0 8px 8px" : 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={anime.coverImage.extraLarge || anime.coverImage.large}
              alt=""
              aria-hidden
              className="block"
              style={{
                position: "absolute",
                left: 0,
                top: -strip.top,
                width: 100,
                height: 140,
                objectFit: "cover",
                filter: `blur(${strip.blur}px)`,
              }}
            />
          </div>
        ))}
        {/* Dark gradient scrim */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: 0,
            bottom: 0,
            width: 100,
            height: 57,
            borderRadius: "0 0 8px 8px",
            background:
              "linear-gradient(0deg, rgba(7,8,10,1) 0%, rgba(7,8,10,0.7) 38%, rgba(7,8,10,0) 100%)",
          }}
        />

        {/* Title — Overused Grotesk 600, 10px, 1.1em line-height, 0.02em tracking */}
        <p
          className="absolute"
          style={{
            left: 9,
            bottom: 9,
            width: 82,
            maxHeight: 33,
            fontWeight: 600,
            fontSize: 10,
            lineHeight: "1.1em",
            letterSpacing: "0.02em",
            color: "#F8FAFE",
            textAlign: "left",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {anime.title.english || anime.title.romaji}
        </p>

        {/* Inner border overlay — rendered last so it sits on top of everything */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ borderRadius: 8, boxShadow: "inset 0 0 0 1px #1B1F28" }}
        />
      </div>
    </motion.div>
  );
}
