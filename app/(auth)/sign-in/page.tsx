"use client";

import AuthForm from "@/components/forms/AuthForm";
import { SignInSchema } from "@/lib/validations";
import { signInWithCredentials } from "@/lib/actions/auth.action";

const SignInPage = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Sign in to your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and password to sign in
        </p>
      </div>
      <AuthForm
        schema={SignInSchema}
        defaultValues={{ email: "", password: "" }}
        formType="SIGN_IN"
        onSubmit={signInWithCredentials}
      />
    </div>
  );
};

export default SignInPage;
