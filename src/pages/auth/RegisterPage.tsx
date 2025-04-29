
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import AuthForm from "@/components/auth/AuthForm";

const RegisterPage = () => {
  return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
          <AuthForm mode="register" />
        </div>
      </div>
  );
};

export default RegisterPage;
