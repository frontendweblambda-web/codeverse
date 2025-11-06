import Link from "next/link";
import AuthTitle from "../_components/auth-title";
import Form from "@/src/components/ui/form";
import Input from "@/src/components/ui/input";
import LoginForm from "../_components/_login-form";
import { getSession } from "@/src/core/session/session";

export default async function Page() {
  const session = await getSession();
  console.log("S", session);
  return (
    <div className="bg-white shadow-sm min-w-md p-6 rounded-md">
      <AuthTitle />
      <LoginForm />
    </div>
  );
}
