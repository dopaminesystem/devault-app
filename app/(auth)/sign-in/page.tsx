import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignInForm from "./sign-in-form";

export default async function SignInPage() {
    const session = await getSession();

    if (session) {
        redirect("/dashboard");
    }

    return <SignInForm />;
}
