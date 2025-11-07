"use client";

import { useActionState } from "react";

import Form from "@/components/ui/form";
import Input from "@/components/ui/input";
import SubmitForm from "@/components/ui/submit-form";

import { createRole } from "../_action";

type RoleFormProps = {};
export default function RoleForm({}: RoleFormProps) {
	const [state, formAction, pending] = useActionState(createRole, undefined);

	return (
		<Form action={formAction}>
			<Input
				name="name"
				placeholder="Enter role name"
				error={state?.errors?.name}
			/>
			<SubmitForm />
		</Form>
	);
}
