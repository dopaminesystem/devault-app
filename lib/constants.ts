

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
