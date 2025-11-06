"use client";

import { useActionState } from "react";
import { signup } from "../_action/auth";
import Link from "next/link";
import Form from "@/src/components/ui/form";
import Input from "@/src/components/ui/input";
import SubmitForm from "@/src/components/ui/submit-form";

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, undefined);

  return (
    <Form action={formAction} className="gap-4 flex flex-col py-6">
      <Input
        error={state?.errors?.name}
        label="Full Name"
        placeholder="Enter full name"
        name="name"
      />
      <Input
        error={state?.errors?.email}
        label="Email"
        placeholder="Enter email"
        name="email"
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          type="password"
          label="Password"
          placeholder="**********"
          name="password"
          error={state?.errors?.password}
          isPassword
        />
        <Input
          label="Mobile"
          placeholder="**********"
          name="mobile"
          error={state?.errors?.mobile}
        />
      </div>
      <SubmitForm className="mt-2" loading={pending} btnLabel="Sign up" />
    </Form>
  );
}
