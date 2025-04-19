"use client";

import AuthForm from "@/components/forms/AuthForm";
import { signUpWithCredentials } from "@/lib/actions/auth.action";
import { SignUpSchema } from "@/lib/validations";

const SignUpPage = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your details to create your account
        </p>
      </div>
      <AuthForm
        schema={SignUpSchema}
        defaultValues={{
          name: "",
          email: "",
          password: "",
          specialization: undefined,
          barNumber: "",
        }}
        formType="SIGN_UP"
        onSubmit={signUpWithCredentials}
      />
    </div>
  );
};

export default SignUpPage;
