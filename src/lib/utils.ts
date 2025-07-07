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


