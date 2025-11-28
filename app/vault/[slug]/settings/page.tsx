import { getVault } from "@/app/actions/vault";
import { VaultSettingsForm } from "@/components/vault/vault-settings-form";
import { auth, getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";

export default async function VaultSettingsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const session = await getSession();
    const { prisma } = await import("@/lib/prisma");

    if (!session?.user) {
        redirect("/sign-in");
    }

    // We use getVault but we need to bypass the access check for the owner settings page
    // Actually getVault handles access check for viewing content.
    // For settings, we need to fetch raw vault and check owner.

    // Let's use prisma directly here for owner check to be safe and explicit
    const vault = await prisma.vault.findUnique({
        where: { slug },
    });

    if (!vault) {
        notFound();
    }

    if (vault.ownerId !== session.user.id) {
        redirect(`/vault/${slug}`);
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">Settings: {vault.name}</h1>
            <VaultSettingsForm vault={vault} />
        </div>
    );
}
