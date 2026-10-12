"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ScrollMarqueeProps {
  line1Text: string;
  line2Text: string;
}

export function ScrollMarquee({ line1Text, line2Text }: ScrollMarqueeProps) {
  const containerRef = useRef<HTMLElement>(null);

  // Hook into viewport scroll progress relative to this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth physics spring so scrolling translates fluidly without jarring stops
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.0005,
  });

  // Moves strictly from Left to Right as the visitor scrolls down through the section
  // When scrolling stops, progress stops and marquee stays completely stationary
  const x1 = useTransform(smoothProgress, [0, 1], ["-28%", "4%"]);
  const x2 = useTransform(smoothProgress, [0, 1], ["-34%", "-2%"]);

  return (
    <section
      ref={containerRef}
      className="py-7 sm:py-9 bg-[#080808] overflow-hidden select-none border-b border-[#181818]"
    >
      {/* Line 1: Primary Brand Line - Moves Left to Right on Scroll */}
      <div className="flex whitespace-nowrap overflow-hidden">
        <motion.div
          style={{ x: x1 }}
          className="flex items-center text-4xl sm:text-6xl font-display font-extrabold uppercase tracking-widest text-white will-change-transform"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="inline-flex items-center shrink-0">
              <span className="hover:text-[var(--brand-primary,#E31E2F)] transition-colors">
                {line1Text}
              </span>
              <span
                className="mx-6 sm:mx-8 font-mono text-3xl sm:text-5xl"
                style={{ color: "var(--brand-primary, #E31E2F)" }}
              >
                ·
              </span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Line 2: Secondary Solid Line - Proper readable solid text matching website color palette */}
      <div className="flex whitespace-nowrap overflow-hidden mt-2.5 sm:mt-3.5">
        <motion.div
          style={{ x: x2 }}
          className="flex items-center text-3xl sm:text-5xl font-display font-bold uppercase tracking-wider text-neutral-300 will-change-transform"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="inline-flex items-center shrink-0">
              <span className="text-neutral-400 hover:text-white transition-colors">
                {line2Text}
              </span>
              <span
                className="mx-6 sm:mx-8 font-mono text-2xl sm:text-4xl opacity-80"
                style={{ color: "var(--brand-primary, #E31E2F)" }}
              >
                ·
              </span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
