"use client";

import Form from "@/src/components/ui/form";
import { useActionState } from "react";
import { createRole } from "../_action";
import Input from "@/src/components/ui/input";
import SubmitForm from "@/src/components/ui/submit-form";

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
