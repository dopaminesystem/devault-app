import { Box, Briefcase, Lock } from "lucide-react"
import type { Vault, Bookmark } from "@/lib/types"

export const MOCK_VAULTS: Vault[] = [
    {
        id: "v1",
        name: "Design Engineering",
        icon: Box,
        color: "bg-emerald-500",
        shadow: "shadow-[0_0_10px_rgba(16,185,129,0.5)]",
    },
    {
        id: "v2",
        name: "Freelance Projects",
        icon: Briefcase,
        color: "bg-blue-500",
        shadow: "shadow-[0_0_10px_rgba(59,130,246,0.5)]",
    },
    {
        id: "v3",
        name: "Private Second Brain",
        icon: Lock,
        color: "bg-rose-500",
        shadow: "shadow-[0_0_10px_rgba(244,63,94,0.5)]",
    },
]

export const MOCK_BOOKMARKS: Bookmark[] = [
    {
        id: "1",
        vaultId: "v1",
        title: "Neon - Serverless Postgres",
        url: "https://neon.tech",
        description:
            "Database serverless yang memisahkan compute dan storage. Cocok banget buat Vercel karena ada fitur scale-to-zero.",
        category: "Backend",
        createdAt: "2025-05-20",
        color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
        id: "2",
        vaultId: "v1",
        title: "Shadcn UI",
        url: "https://ui.shadcn.com",
        description:
            "Koleksi komponen copy-paste yang bisa dikustomisasi penuh. Dibangun di atas Radix UI dan Tailwind CSS.",
        category: "Design System",
        createdAt: "2025-05-21",
        color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    },
    {
        id: "3",
        vaultId: "v1",
        title: "Better Auth",
        url: "https://better-auth.com",
        description: "Library autentikasi TypeScript-first yang sangat komprehensif. Support framework apapun.",
        category: "Auth",
        createdAt: "2025-05-22",
        color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    {
        id: "4",
        vaultId: "v1",
        title: "Drizzle ORM",
        url: "https://orm.drizzle.team",
        description: "TypeScript ORM yang ringan dan performanya mendekati raw SQL.",
        category: "Database",
        createdAt: "2025-05-18",
        color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
    {
        id: "5",
        vaultId: "v2",
        title: "Midjourney",
        url: "https://midjourney.com",
        description: "AI Art generator untuk kebutuhan aset visual klien.",
        category: "AI Tools",
        createdAt: "2025-05-15",
        color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },
    {
        id: "6",
        vaultId: "v2",
        title: "Upwork",
        url: "https://upwork.com",
        description: "Platform cari project freelance global.",
        category: "Jobs",
        createdAt: "2025-05-10",
        color: "bg-green-500/10 text-green-400 border-green-500/20",
    },
]

export const TOKENS = {
    canvas: "bg-zinc-950 text-zinc-100 antialiased selection:bg-indigo-500/30 font-sans min-h-screen",
    card: "rounded-xl border bg-zinc-900/40 border-zinc-800/60 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-900/60 hover:border-zinc-700 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 cursor-pointer",
    panel: "rounded-2xl border bg-zinc-950/80 border-zinc-800/80 backdrop-blur-xl shadow-2xl",
    sheetOverlay: "fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40 transition-opacity duration-300",
    sheetContent:
        "fixed top-2 right-2 bottom-2 w-full max-w-md bg-zinc-950/95 border border-zinc-800 rounded-2xl shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col backdrop-blur-xl",
    input:
        "flex h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 shadow-sm transition-colors placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50",
    badge:
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider transition-colors border border-transparent",
    btn: "flex items-center justify-center gap-2 rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
    btnPrimary:
        "bg-zinc-100 px-6 py-3 text-sm font-semibold text-zinc-950 hover:bg-white shadow-[0_0_20px_rgba(255,255,255,0.1)]",
    btnSecondary:
        "border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-xl",
    sidebarItem: "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 w-full",
    sidebarActive: "bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-sm",
    sidebarInactive: "text-zinc-400 hover:text-zinc-200 border border-transparent hover:bg-zinc-900/30",
}
