import { auth, getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Manage your vaults and bookmarks.</p>
                </div>
            </div>

            {vaults.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-semibold">No vaults found</h2>
                        <p className="text-muted-foreground">Create your first vault to get started.</p>
                    </div>
                    <CreateVaultForm />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {vaults.map((vault: any) => (
                        <Card key={vault.id} className="hover:bg-muted/50 transition-colors">
                            <CardHeader>
                                <CardTitle>{vault.name}</CardTitle>
                                <CardDescription>/{vault.slug}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href={`/vault/${vault.slug}`} passHref>
                                    <Button variant="outline" className="w-full">
                                        Open Vault
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
