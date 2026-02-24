import { Monitor } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export default function MobileBlockedPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      {/* Decorative Gradients */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-950/20 to-transparent pointer-events-none" />

      <Card className="w-full max-w-md text-center bg-zinc-900/50 border-zinc-800">
        <CardHeader className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <Monitor className="h-8 w-8 text-indigo-400" />
          </div>
          <CardTitle className="text-2xl">Desktop Only</CardTitle>
          <CardDescription className="text-zinc-400">
            Devault is optimized for desktop browsers. Please access this site from a computer for
            the best experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-zinc-500">
            We&apos;re working on a mobile experience. Stay tuned!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
