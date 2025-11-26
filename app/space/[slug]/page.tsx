import { getSpace } from "@/app/actions/space";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SpacePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const result = await getSpace(slug);

    if (result.error === "Space not found") {
        notFound();
    }

    if (result.error === "Access denied" || result.error === "Unauthorized") {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <Lock className="h-6 w-6" />
                        </div>
                        <CardTitle>Access Denied</CardTitle>
                        <CardDescription>
                            You do not have permission to view this space.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-sm text-muted-foreground">
                            This space is restricted. You may need to sign in or join a specific Discord server to access it.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button asChild variant="outline">
                                <Link href="/dashboard">Go to Dashboard</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/sign-in">Sign In</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (result.error) {
        return <div>Error: {result.error}</div>;
    }

    const { space } = result;

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold">{space?.name}</h1>
                <p className="text-muted-foreground">{space?.description || "No description"}</p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Bookmarks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">No bookmarks yet.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
