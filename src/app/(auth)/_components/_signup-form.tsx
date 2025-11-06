"use client";

import { useActionState, useEffect } from "react";

import { useRouter } from "next/navigation";

import Form from "@/components/ui/form";
import Input from "@/components/ui/input";
import SubmitForm from "@/components/ui/submit-form";

import { toast } from "react-toastify";

import { signup } from "../_action/auth";

export default function SignupForm() {
	const [state, formAction, pending] = useActionState(signup, undefined);
	const router = useRouter();
	useEffect(() => {
		if (state?.state == "error") {
			toast.error(state.message);
		}

		if (state?.success) {
			toast.success(state.message);
			setTimeout(() => {
				router.push("/login");
			}, 3000);
		}
	}, [state, router]);

	return (
		<>
			{pending && <p>Please wait, we are creating account...</p>}
			<Form action={formAction} className="gap-4 flex flex-col py-6">
				<Input
					error={state?.errors?.name}
					label="Full Name"
					placeholder="Enter full name"
					name="name"
					defaultValue={state?.values?.name ?? ""}
				/>
				<Input
					error={state?.errors?.email}
					label="Email"
					placeholder="Enter email"
					name="email"
					defaultValue={state?.values?.email ?? ""}
				/>
				<div className="grid grid-cols-2 gap-3">
					<Input
						type="password"
						label="Password"
						placeholder="**********"
						name="password"
						error={state?.errors?.password}
						isPassword
						defaultValue={state?.values?.password ?? ""}
					/>
					<Input
						label="Mobile"
						placeholder="**********"
						name="mobile"
						error={state?.errors?.mobile}
						defaultValue={state?.values?.mobile ?? ""}
					/>
				</div>
				<SubmitForm className="mt-2" loading={pending} btnLabel="Sign up" />
			</Form>
		</>
	);
}
