import { auth, getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Vault } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CreateVaultForm } from "@/components/vault/create-vault-form";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
    const session = await getSession();

    if (!session?.user) {
        redirect("/sign-in");
    }

    const vaults = await prisma.vault.findMany({
        where: {
            OR: [
                { ownerId: session.user.id },
                { members: { some: { userId: session.user.id } } }
            ]
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p>Welcome to your space manager.</p>
        </div>
    );
}
