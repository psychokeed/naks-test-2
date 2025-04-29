
import React from "react";
import AuthForm from "@/components/auth/AuthForm";

const SignInPage = () => {
  return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
          <AuthForm mode="signin" />
        </div>
      </div>
  );
};

export default SignInPage;
