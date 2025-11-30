import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DefaultVaultForm } from "@/components/user/default-vault-form";
import { Button } from "@/components/ui/button";
import { ConnectDiscordButton } from "@/components/user/connect-discord-button";
import { FaDiscord } from "react-icons/fa";

export default async function SettingsPage() {
    const session = await getSession();

    if (!session?.user) {
        redirect("/sign-in");
    }

    // Fetch user with default vault and accounts
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            defaultVaultId: true,
            accounts: true
        },
    });

    const discordAccount = user?.accounts.find(a => a.providerId === "discord");

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
                    isPro={false}
                />

                <div className="space-y-4 pt-6 border-t">
                    <h2 className="text-xl font-semibold">Connected Accounts</h2>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                            <FaDiscord className="h-8 w-8 text-[#5865F2]" />
                            <div>
                                <p className="font-medium">Discord</p>
                                <p className="text-sm text-muted-foreground">
                                    {discordAccount
                                        ? "Your account is connected."
                                        : "Connect to save bookmarks directly from Discord."}
                                </p>
                            </div>
                        </div>
                        {discordAccount ? (
                            <Button variant="outline" disabled>Connected</Button>
                        ) : (
                            <ConnectDiscordButton />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
