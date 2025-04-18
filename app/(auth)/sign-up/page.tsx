'use client'

import AuthForm from "@/components/forms/AuthForm";
import { signUpWithCredentials } from "@/lib/actions/auth.action";
import { SignUpSchema } from "@/lib/validations";
import React from "react";

const SignUpPage = () => {
  return <AuthForm
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
  />;
};

export default SignUpPage;
