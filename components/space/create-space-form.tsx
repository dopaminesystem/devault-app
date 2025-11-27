"use client";

import { createSpace, State } from "@/app/actions/space";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

const initialState: State = {
    message: null,
    errors: {},
};

export function CreateSpaceForm() {
    const [state, formAction, isPending] = useActionState(createSpace, initialState);
    const [accessType, setAccessType] = useState("PUBLIC");
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.refresh();
            // Optionally redirect or show success message
        }
    }, [state, router]);

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Create New Space</CardTitle>
                <CardDescription>Create a space to share your bookmarks.</CardDescription>
            </CardHeader>
            <form action={formAction}>
                <CardContent className="space-y-4">
                    {state?.message && !state.success && (
                        <div className="text-sm text-red-500 font-medium">
                            {state.message}
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" placeholder="My Awesome Space" required aria-describedby="name-error" />
                        <div id="name-error" aria-live="polite" aria-atomic="true">
                            {state?.errors?.name &&
                                state.errors.name.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" name="slug" placeholder="my-awesome-space" required aria-describedby="slug-error" />
                        <div id="slug-error" aria-live="polite" aria-atomic="true">
                            {state?.errors?.slug &&
                                state.errors.slug.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="accessType">Access Type</Label>
                        <Select name="accessType" value={accessType} onValueChange={setAccessType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select access type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PUBLIC">Public</SelectItem>
                                <SelectItem value="PASSWORD">Password Protected</SelectItem>
                                <SelectItem value="DISCORD_GATED">Discord Gated</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {accessType === "DISCORD_GATED" && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="discordGuildId">Discord Guild ID</Label>
                                <Input
                                    id="discordGuildId"
                                    name="discordGuildId"
                                    placeholder="123456789012345678"
                                    required
                                    aria-describedby="discordGuildId-error"
                                />
                                <div id="discordGuildId-error" aria-live="polite" aria-atomic="true">
                                    {state?.errors?.discordGuildId &&
                                        state.errors.discordGuildId.map((error: string) => (
                                            <p className="mt-2 text-sm text-red-500" key={error}>
                                                {error}
                                            </p>
                                        ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="discordRoleId">Discord Role ID (Optional)</Label>
                                <Input
                                    id="discordRoleId"
                                    name="discordRoleId"
                                    placeholder="123456789012345678"
                                />
                            </div>
                        </>
                    )}
                </CardContent>
                <CardFooter>
                    <Button className="w-full" type="submit" disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Create Space
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
