import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

export function DashboardButton() {
  return (
    <Link href="/dashboard">
      <Button
        variant="outline"
        className="border-white/10 bg-white/5 hover:bg-white/10 text-zinc-100 backdrop-blur-md rounded-full h-9"
      >
        Dashboard <ArrowRight className="w-4 h-4 ml-2 opacity-50" />
      </Button>
    </Link>
  );
}
