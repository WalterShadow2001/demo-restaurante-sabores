"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

type MotionDivProps = HTMLMotionProps<"div">;

/**
 * Wrapper to use framer-motion in server components.
 * Provides the same motion.div API but is a client component.
 */
export const MotionDiv = forwardRef<HTMLDivElement, MotionDivProps>(
  function MotionDiv(props, ref) {
    return <motion.div ref={ref} {...props} />;
  }
);

type MotionSectionProps = HTMLMotionProps<"section">;

export const MotionSection = forwardRef<HTMLElement, MotionSectionProps>(
  function MotionSection(props, ref) {
    return <motion.section ref={ref} {...props} />;
  }
);

type MotionArticleProps = HTMLMotionProps<"article">;

export const MotionArticle = forwardRef<HTMLElement, MotionArticleProps>(
  function MotionArticle(props, ref) {
    return <motion.article ref={ref} {...props} />;
  }
);
