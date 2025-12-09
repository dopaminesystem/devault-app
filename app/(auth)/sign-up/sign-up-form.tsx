"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { TOKENS } from "@/lib/constants"
import { signUpAction } from "@/app/actions/auth"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useActionState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FaDiscord } from "react-icons/fa"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { enableEmailSignInAction } from "@/app/actions/auth"

export default function SignUpForm() {
    const [isRegister, setIsRegister] = useState(true)
    const [state, formAction, pending] = useActionState(signUpAction, { error: "", success: false })

    // Controlled inputs to pass to the enable dialog
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [enableState, enableAction, enablePending] = useActionState(enableEmailSignInAction, { error: "", success: false })

    const router = useRouter()

    useEffect(() => {
        if (state?.success) {
            router.push("/dashboard")
        }
    }, [state?.success, router])

    const handleDiscordSignIn = async () => {
        await authClient.signIn.social({
            provider: "discord",
            callbackURL: "/dashboard",
        })
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-in fade-in zoom-in-95 duration-500 bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
            {/* Decorative Gradients */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-950/20 to-transparent pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-radial-gradient from-blue-900/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            <Link
                href="/"
                className="absolute top-8 left-8 text-zinc-500 hover:text-white flex items-center gap-2 text-sm transition-colors z-10"
            >
                <ArrowRight className="w-4 h-4 rotate-180" /> Back to Home
            </Link>

            <div className="flex flex-col items-center mb-8 space-y-2 z-10">

                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                    Join the Vault
                </h1>
                <p className="text-sm text-zinc-500">Create an account to start collecting.</p>
            </div>

            <div className={`${TOKENS.panel} w-full max-w-sm p-6 sm:p-8 space-y-6 z-10`}>
                <div className="flex items-center gap-4 border-b border-zinc-800/50 pb-2 mb-2">
                    <Link
                        href="/sign-in"
                        className={`pb-2 text-sm font-medium transition-colors relative ${!isRegister ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
                            }`}
                    >
                        Log In
                    </Link>
                    <button
                        onClick={() => setIsRegister(true)}
                        className={`pb-2 text-sm font-medium transition-colors relative ${isRegister ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
                            }`}
                    >
                        Register
                        {isRegister && (
                            <span className="absolute bottom-[-9px] left-0 w-full h-[2px] bg-indigo-500 rounded-t-full shadow-[0_-2px_10px_rgba(99,102,241,0.5)]" />
                        )}
                    </button>
                </div>

                <form action={formAction} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 ml-1">Full Name</label>
                        <input name="name" type="text" placeholder="Dhafin" className={TOKENS.input} autoFocus required />
                        {state?.fieldErrors?.name && (
                            <p className="text-xs text-red-500 ml-1">{state.fieldErrors.name[0]}</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 ml-1">Email</label>
                        <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="design@engineer.com" className={TOKENS.input} required />
                        {state?.fieldErrors?.email && (
                            <p className="text-xs text-red-500 ml-1">{state.fieldErrors.email[0]}</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 ml-1">Password</label>
                        <input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={TOKENS.input} required />
                        {state?.fieldErrors?.password && (
                            <p className="text-xs text-red-500 ml-1">{state.fieldErrors.password[0]}</p>
                        )}
                    </div>
                    {state?.error && (
                        <p className="text-xs text-red-500 text-center">{state.error}</p>
                    )}

                    <Button type="submit" disabled={pending} className="w-full mt-2 group">
                        {pending ? "Creating Account..." : "Create Account"}
                        <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-zinc-800" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                        <span className="bg-zinc-950 px-2 text-zinc-500">Or continue with</span>
                    </div>
                </div>

                <div className="flex gap-3">

                    <Button variant="outline" onClick={handleDiscordSignIn} className="w-full">
                        <FaDiscord className="w-4 h-4" /> <span className="hidden sm:inline">Discord</span>
                    </Button>
                </div>
            </div>

            <p className="mt-8 text-center text-xs text-zinc-600 z-10">
                By clicking continue, you agree to our <br />
                <a href="#" className="underline hover:text-zinc-400">
                    Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline hover:text-zinc-400">
                    Privacy Policy
                </a>
                .
            </p>


            <AlertDialog open={state?.error === "AccountExistsViaProvider"}>
                <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Existing Account Found</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">
                            {state?.message || "There is already an account associated with this email via Discord."}
                            <br /><br />
                            Do you want to enable password sign-in for this account? This will set the password you just entered.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300">Cancel</AlertDialogCancel>
                        <form action={enableAction}>
                            <input type="hidden" name="email" value={email} />
                            <input type="hidden" name="password" value={password} />
                            <Button type="submit" disabled={enablePending} className="bg-indigo-600 hover:bg-indigo-700 text-white border-0">
                                {enablePending ? "Enabling..." : "Enable & Sign In"}
                            </Button>
                        </form>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
