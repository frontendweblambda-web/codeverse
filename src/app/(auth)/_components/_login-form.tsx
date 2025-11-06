"use client";

import { useActionState, useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import Checkbox from "@/components/ui/checkbox";
import Form from "@/components/ui/form";
import Input from "@/components/ui/input";
import SubmitForm from "@/components/ui/submit-form";

import { toast } from "react-toastify";

import { login } from "../_action/auth";

export default function LoginForm() {
	const [state, formAction, pending] = useActionState(login, undefined);

	const router = useRouter();
	useEffect(() => {
		if (state?.state == "error") {
			toast.error(state.message);
		}

		if (state?.success) {
			toast.success(state.message);
		}
	}, [state, router]);

	return (
		<Form action={formAction} className="gap-3 flex flex-col py-6">
			{pending && <p>Please wait...</p>}
			<Input label="Email" placeholder="Enter email" name="email" />
			<Input
				type="password"
				label="Password"
				placeholder="**********"
				name="password"
				isPassword
			/>
			<div className="flex justify-between">
				<Checkbox name="remember" label="Remember me" />
				<Link
					className="text-xs text-gray-600 hover:text-rose-600"
					href="/forgot-password">
					Forgot password
				</Link>
			</div>
			<SubmitForm loading={pending} btnLabel="Login" />
		</Form>
	);
}
