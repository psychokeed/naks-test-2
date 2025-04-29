
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AccountPage = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Please sign in</h1>
          <Button asChild>
            <Link to="/signin">Sign In</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Account</h1>
          <Button variant="outline" onClick={logout}>
            Sign Out
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {user.fullName && (
                  <div>
                    <label className="text-sm text-gray-500">Name</label>
                    <p className="font-medium">{user.fullName}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="ghost" className="w-full justify-start">
                  <Link to="/appointments">My Appointments</Link>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start">
                  <Link to="/orders">My Orders</Link>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start">
                  <Link to="/cart">Shopping Cart</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AccountPage;
