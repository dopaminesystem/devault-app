export const SITE_CONFIG = {
  name: "Devault",
  tagline: "Vault for everyone",
  description:
    "A secure, intelligent vault for your bookmarks, code snippets, and resources. Featuring AI organization, self-hosting capabilities, and seamless sync.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://devault.app",
  ogImage: "/api/og",
  keywords: ["bookmarks", "vault", "organizer", "ai", "resources"],
  themeColor: "#09090b", // zinc-950
};

export const TOKENS = {
  canvas:
    "bg-ds-canvas text-ds-text-primary antialiased selection:bg-[--ds-selection] font-sans min-h-screen",
  card: "rounded-xl border bg-ds-surface-raised border-ds-border backdrop-blur-sm transition-all duration-300 hover:bg-ds-surface-hovered hover:border-ds-border-strong hover:shadow-xl hover:shadow-ds-brand/5 hover:-translate-y-1 cursor-pointer",
  panel: "rounded-2xl border bg-ds-overlay border-ds-border-subtle backdrop-blur-xl shadow-2xl",
  sheetOverlay:
    "fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40 transition-opacity duration-300",
  sheetContent:
    "fixed top-2 right-2 bottom-2 w-full max-w-md bg-ds-overlay border border-ds-border rounded-2xl shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col backdrop-blur-xl",
  input:
    "flex h-10 w-full rounded-xl border border-ds-border bg-ds-surface-raised px-3 py-2 text-sm text-ds-text-primary shadow-sm transition-colors placeholder:text-ds-text-muted focus:outline-none focus:ring-1 focus:ring-[--comp-input-ring] disabled:cursor-not-allowed disabled:opacity-50",
  badge:
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider transition-colors border border-transparent",
  btn: "flex items-center justify-center gap-2 rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
  btnPrimary:
    "bg-ds-text-primary px-6 py-3 text-sm font-semibold text-ds-canvas hover:bg-white shadow-[0_0_20px_rgba(255,255,255,0.1)]",
  btnSecondary:
    "border border-ds-border bg-ds-surface-raised px-4 py-2.5 text-sm font-medium text-ds-text-secondary hover:bg-ds-surface hover:text-ds-text-primary rounded-xl",
  sidebarItem:
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 w-full",
  sidebarActive:
    "bg-ds-brand-subtle text-ds-brand-text hover:bg-ds-brand-subtle hover:text-[--ds-brand-text-dim]",
  sidebarInactive:
    "text-ds-text-secondary hover:text-ds-text-primary border border-transparent hover:bg-ds-surface-raised",
};
