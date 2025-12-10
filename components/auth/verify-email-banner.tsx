"use client"

import { useSession } from "@/lib/auth-client"
import { resendVerificationEmailAction } from "@/app/actions/auth"
import { AlertCircle, Send } from "lucide-react"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"

const initialState = { success: false, error: "", message: "" }

export function VerifyEmailBanner() {
    const { data: session } = useSession()
    const [state, formAction, pending] = useActionState(resendVerificationEmailAction, initialState)

    useEffect(() => {
        if (state.success && state.message) {
            toast.success(state.message, {
                description: "Please check your inbox."
            })
        }
        if (!state.success && state.error) {
            toast.error("Failed to send email", {
                description: state.error
            })
        }
    }, [state])

    if (!session?.user) return null
    if (session.user.emailVerified) return null

    return (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2 flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2 text-yellow-500">
                <AlertCircle className="w-4 h-4" />
                <span>Your email address is not verified. Please check your inbox.</span>
            </div>
            <form action={formAction}>
                <button
                    type="submit"
                    disabled={pending}
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 transition-colors text-xs font-medium disabled:opacity-50"
                >
                    {pending && "Sending..."}
                    {!pending && (
                        <>
                            <Send className="w-3 h-3" />
                            Resend Email
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}
