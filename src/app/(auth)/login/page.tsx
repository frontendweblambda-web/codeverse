import AuthTitle from "../_components/auth-title";
import LoginForm from "../_components/_login-form";

export default async function Page() {
  return (
    <div className="bg-white shadow-sm min-w-md p-6 rounded-md">
      <AuthTitle />
      <LoginForm />
    </div>
  );
}
