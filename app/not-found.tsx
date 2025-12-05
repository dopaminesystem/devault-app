import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 relative overflow-hidden p-4">
            {/* Decorative Gradients */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-950/20 to-transparent pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-radial-gradient from-blue-900/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-md">
                <div className="w-24 h-24 rounded-3xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-center shadow-2xl shadow-indigo-500/10 animate-in zoom-in-50 duration-500">
                    <FileQuestion className="w-10 h-10 text-zinc-500" />
                </div>

                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                    <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                        Page Not Found
                    </h1>
                    <p className="text-zinc-400">
                        The page you are looking for doesn't exist or has been moved.
                    </p>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <Button asChild className="bg-zinc-100 text-zinc-950 hover:bg-white">
                        <Link href="/">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
