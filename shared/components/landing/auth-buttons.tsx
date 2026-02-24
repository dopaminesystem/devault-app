import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

export function AuthButtons() {
  return (
    <>
      <Link
        href="/sign-in"
        className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
      >
        Log In
      </Link>
      <Link href="/sign-up">
        <Button
          variant="outline"
          className="border-white/10 bg-white/5 hover:bg-white/10 text-zinc-100 backdrop-blur-md rounded-full h-9"
        >
          Sign Up
        </Button>
      </Link>
    </>
  );
}
