import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/db/prisma";

// Lightweight data endpoint for OG image generation
// This runs on Node.js runtime (not Edge) so it can use Prisma
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const vault = await prisma.vault.findUnique({
      where: { slug },
      select: { name: true, description: true },
    });

    if (!vault) {
      return NextResponse.json({ name: slug, description: null }, { status: 404 });
    }

    return NextResponse.json({
      name: vault.name,
      description: vault.description,
    });
  } catch {
    return NextResponse.json({ name: slug, description: null }, { status: 500 });
  }
}
