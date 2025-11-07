import Link from "next/link";

import LoginForm from "../_components/_login-form";
import AuthTitle from "../_components/auth-title";

export default async function Page() {
	return (
		<div className="bg-white shadow-sm max-w-md p-6 rounded-md">
			<AuthTitle />
			<LoginForm />
			<div className="flex justify-center items-center">
				<p className="text-xs font-normal text-gray-500">
					If you don't have an account, please click to{" "}
					<Link className="text-slate-700 hover:text-rose-500" href="/signup">
						Sign up
					</Link>
				</p>
			</div>
			<p className="text-gray-500 text-xs mt-3 leading-normal font-normal px-6 text-center">
				By clicking continue, you agree to our{" "}
				<Link className="text-slate-700 hover:text-rose-500" href="/terms">
					Terms of Service
				</Link>{" "}
				and{" "}
				<Link className="text-slate-700 hover:text-rose-500" href="/privacy">
					Privacy Policy
				</Link>
				.
			</p>
		</div>
	);
}
