import type { Bookmark, Category, Vault } from "@prisma/client";

export type { Vault, Bookmark, Category };

/**
 * Bookmark with its associated Category included.
 * Useful for displaying bookmarks with their category badges.
 */
export type BookmarkWithCategory = Bookmark & {
  category: Category;
};

/**
 * Generic state for server actions.
 * @template T - Type of the data returned on success.
 */
export type ActionState<T = undefined> = {
  /** Indicates if the action was successful */
  success: boolean;
  /** User-friendly message for toast notifications or alerts */
  message?: string;
  /** General error message */
  error?: string;
  /** Field-specific validation errors */
  fieldErrors?: Record<string, string[]>;
  /** Returned data if successful */
  data?: T;
};

/**
 * Possible application view states in the vault switcher or main layout.
 */
export type ViewState = "landing" | "auth" | "dashboard";
