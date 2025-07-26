import { Subscriber } from "@prisma/client";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


interface FormatStringOptions {
  input: string;
}

export function formatString(input: FormatStringOptions["input"]): string {
  return input
    .split('_')                           // Split by underscores
    .map((word: string) => 
      word.charAt(0).toUpperCase() +     // Capitalize first letter
      word.slice(1).toLowerCase()        // Lowercase rest
    )
    .join(' ');                           // Join words with space
}


export function getCurrentMonthKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // getMonth() is 0-based

  return `${year}-${month}`; // e.g., "2025-07"
}


export const calculatePercentage = (
  numerator: number,
  denominator: number,
  decimalPlaces = 2
): number => {
  if (!denominator) return 0;
  const percentage = (numerator / denominator) * 100;
  return Math.min(100, parseFloat(percentage.toFixed(decimalPlaces)));
};







// types.ts
export interface PostPerformanceMetrics {
  seoScore?: number;
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
}

// performanceUtils.ts
/**
 * Calculates a comprehensive performance score (0-100) for a post
 * @param post Object containing post performance metrics
 * @returns Performance score between 0 and 100
 */
export const calculatePerformanceScore = (post: PostPerformanceMetrics): number => {
  // Weights for different metrics (adjust as needed)
  const WEIGHTS = {
    seo: 0.35,
    engagement: 0.40,
    reach: 0.25
  };

  // Calculate individual components (0-100 scale)
  const seoComponent = Math.min(post.seoScore || 0, 100);
  
  // Engagement: weighted sum of interactions normalized by views
  const engagementComponent = Math.min(
    100,
    ((post.likes || 0) * 0.5 + 
     (post.comments || 0) * 1.5 + 
     (post.shares || 0) * 2) / 
    (post.views && post.views > 0 ? post.views : 1) * 1000
  );

  // Reach: logarithmic scale to normalize view counts
  const reachComponent = Math.min(
    100,
    Math.log10((post.views || 0) + 1) * 20
  );

  // Calculate weighted score
  const weightedScore = 
    (seoComponent * WEIGHTS.seo) +
    (engagementComponent * WEIGHTS.engagement) + 
    (reachComponent * WEIGHTS.reach);

  // Normalize to 0-100 scale
  return Math.round(Math.min(100, Math.max(0, weightedScore)));
};





