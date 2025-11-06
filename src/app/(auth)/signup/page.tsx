import Link from "next/link";

import SignupForm from "../_components/_signup-form";
import AuthTitle from "../_components/auth-title";

export default function Page() {
	return (
		<div className="bg-white shadow-sm max-w-md p-6 rounded-md">
			<AuthTitle title="Create an account" subtitle="Fill the form" />
			<SignupForm />
			<div
				data-slot="field-separator"
				data-content="true"
				className="relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2">
				<div
					data-orientation="horizontal"
					role="none"
					data-slot="separator"
					className="bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px absolute inset-0 top-1/2"></div>
				<span
					className="bg-background text-muted-foreground relative mx-auto block w-fit px-2"
					data-slot="field-separator-content">
					Or continue with
				</span>
			</div>
			<div className="flex justify-center items-center">
				<p className="text-xs font-normal text-gray-500">
					If you don't have an account, please click to{" "}
					<Link className="text-slate-700 hover:text-rose-500" href="/login">
						Login
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
