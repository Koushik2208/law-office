'use client'

import AuthForm from "@/components/forms/AuthForm";
import { SignInSchema } from "@/lib/validations";
import { signInWithCredentials } from "@/lib/actions/auth.action";
import React from "react";

const SignInPage = () => {
  return <AuthForm
    schema={SignInSchema}
    defaultValues={{ email: "", password: "" }}
    formType="SIGN_IN"
    onSubmit={signInWithCredentials}
  />;
};

export default SignInPage;