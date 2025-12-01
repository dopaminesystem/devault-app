import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getSession();

    if (!session?.user) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
        authenticated: true,
        user: {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
        },
    });
}