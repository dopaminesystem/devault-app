import type { LucideIcon } from "lucide-react"

export type Vault = {
    id: string
    name: string
    icon: LucideIcon
    color: string
    shadow: string
}

export type Bookmark = {
    id: string
    vaultId: string
    title: string
    url: string
    description: string
    category: string
    createdAt: string
    color: string
}

export type ViewState = "landing" | "auth" | "dashboard"
