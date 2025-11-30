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
