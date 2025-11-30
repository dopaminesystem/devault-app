"use client";

import dynamic from "next/dynamic";
import { Vault } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const DefaultVaultForm = dynamic(
    () => import("./default-vault-form").then((mod) => mod.DefaultVaultForm),
    {
        ssr: false,
        loading: () => (
            <Card>
                <CardHeader>
                    <CardTitle>Default Vault</CardTitle>
                    <CardDescription>
                        Select the vault where bookmarks from Discord will be saved by default.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
                </CardContent>
            </Card>
        ),
    }
);

interface DefaultVaultFormWrapperProps {
    vaults: Vault[];
    defaultVaultId?: string | null;
    isPro?: boolean;
}

export function DefaultVaultFormWrapper(props: DefaultVaultFormWrapperProps) {
    return <DefaultVaultForm {...props} />;
}
