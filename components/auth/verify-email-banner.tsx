"use client"

import { authClient } from "@/lib/auth-client"
import { AlertCircle, Send } from "lucide-react"
import { useState } from "react"

// Checking package.json... I don't see sonner. I'll use simple alert or check existing toast usage.
// I'll stick to basic button state for now and maybe alert().
// Wait, I should check if there's a toast lib. package.json didn't show sonner/toast. 
// I'll just use text feedback.

export function VerifyEmailBanner() {
    const { data: session } = authClient.useSession()
    const [pending, setPending] = useState(false)
    const [sent, setSent] = useState(false)

    if (!session?.user) return null
    if (session.user.emailVerified) return null

    const handleResend = async () => {
        setPending(true)
        try {
            await authClient.sendVerificationEmail({
                email: session.user.email,
                callbackURL: "/dashboard"
            })
            setSent(true)
            setTimeout(() => setSent(false), 5000)
        } catch (error) {
            console.error(error)
        } finally {
            setPending(false)
        }
    }

    return (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2 flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2 text-yellow-500">
                <AlertCircle className="w-4 h-4" />
                <span>Your email address is not verified. Please check your inbox.</span>
            </div>
            <button
                onClick={handleResend}
                disabled={pending || sent}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 transition-colors text-xs font-medium disabled:opacity-50"
            >
                {pending ? (
                    "Sending..."
                ) : sent ? (
                    "Sent!"
                ) : (
                    <>
                        <Send className="w-3 h-3" />
                        Resend Email
                    </>
                )}
            </button>
        </div>
    )
}
