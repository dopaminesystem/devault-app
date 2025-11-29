import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DefaultVaultForm } from "@/components/user/default-vault-form";

export default async function SettingsPage() {
    const session = await getSession();

    if (!session?.user) {
        redirect("/sign-in");
    }

    // Fetch user with default vault
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { defaultVaultId: true },
    });

    // Fetch available vaults
    const vaults = await prisma.vault.findMany({
        where: {
            OR: [
                { ownerId: session.user.id },
                { members: { some: { userId: session.user.id } } },
            ],
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="container max-w-4xl py-10 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <div className="space-y-6">
                <DefaultVaultForm
                    vaults={vaults}
                    defaultVaultId={user?.defaultVaultId}
                />
            </div>
        </div>
    );
}
