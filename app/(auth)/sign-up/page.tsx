import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignUpForm from "./sign-up-form";

export default async function SignUpPage() {
    const session = await getSession();

    if (session) {
        redirect("/dashboard");
    }

    return <SignUpForm />;
}
