import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import SignUpForm from "./sign-up-form";

export default async function SignUpPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return <SignUpForm />;
}
