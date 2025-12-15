import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeUrl(url: string): string {
  url = url.trim();
  // Check if it starts with http:// or https://
  if (!url.match(/^https?:\/\//i)) {
    return `https://${url}`;
  }
  return url;
}

export const getCategoryColor = (categoryName: string) => {
  const colors = [
    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'bg-rose-500/10 text-rose-400 border-rose-500/20',
  ];
  const index = categoryName.length % colors.length;
  return colors[index];
};

/**
 * ⚡ PERF: Cache for parsed hostnames to avoid repeated URL parsing.
 * URL parsing is relatively expensive, so we cache results.
 */
const hostnameCache = new Map<string, string>();

/**
 * ⚡ PERF: Safely extract hostname from URL with caching.
 * Falls back to the URL itself if parsing fails.
 * 
 * @param url - The URL to parse
 * @returns The hostname or fallback string
 */
export function getHostname(url: string): string {
  // Check cache first
  const cached = hostnameCache.get(url);
  if (cached) return cached;

  try {
    const hostname = new URL(url).hostname;
    // Cache the result (limit cache size to prevent memory issues)
    if (hostnameCache.size < 1000) {
      hostnameCache.set(url, hostname);
    }
    return hostname;
  } catch {
    // Return a fallback for invalid URLs
    return url.replace(/^https?:\/\//, '').split('/')[0] || 'unknown';
  }
}
