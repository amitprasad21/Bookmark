/**
 * Utility Functions
 * 
 * Helper functions used throughout the application
 * - Class name merging with clsx and tailwind-merge
 * - URL validation
 * - Formatting helpers
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge multiple class names, handling Tailwind CSS conflicts
 * 
 * Example:
 * cn("px-2 py-1", "px-4") => "py-1 px-4"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validate if string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get domain from URL
 */
export function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "link";
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number = 50): string {
  return text.length > length ? text.slice(0, length) + "..." : text;
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}
