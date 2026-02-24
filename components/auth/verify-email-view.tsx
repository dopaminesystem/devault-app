"use client";

import { LogOut, Mail, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient, useSession } from "@/lib/auth-client";

export function VerifyEmailView() {
  const { data: session } = useSession();
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const handleResend = async () => {
    setPending(true);
    try {
      if (session?.user?.email) {
        await authClient.sendVerificationEmail({
          email: session.user.email,
          callbackURL: "/dashboard",
        });
        setSent(true);
        setTimeout(() => setSent(false), 5000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPending(false);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
  };

  if (!session?.user) return null;

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      {/* Decorative Gradients same as sign-in for consistency */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-950/20 to-transparent pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-radial-gradient from-blue-900/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center space-y-6 backdrop-blur-sm">
        <div className="mx-auto w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 mb-2">
          <Mail className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Verify your email</h1>
          <p className="text-zinc-400">
            You need to verify your email address to access the dashboard. We&apos;ve sent a link to{" "}
            <span className="text-zinc-200 font-medium">{session.user.email}</span>.
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <Button
            onClick={handleResend}
            disabled={pending || sent}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {pending ? (
              "Sending..."
            ) : sent ? (
              "Email Sent!"
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Resend Verification Email
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleSignOut}
            className="w-full border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
