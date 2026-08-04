"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserCard from "@/components/UserCard";
import { toggleLoginDialog } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { BookOpen, Heart, ShoppingCart, User, LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useSelector((state: RootState) => state.user);
  const pathName = usePathname();
  const dispatch = useDispatch();

  const navItems = [
    { href: "/account/profile", label: "My Profile", icon: User },
    { href: "/account/order", label: "My Orders", icon: ShoppingCart },
    { href: "/account/selling-products", label: "Selling Products", icon: BookOpen },
    { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  ];

  return (
    <main className="min-h-[calc(100vh-80px)] bg-surface py-8 px-4 sm:px-6 lg:px-12 xl:px-16">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Navigation for Desktop */}
        <Card className="w-full lg:w-80 shrink-0 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-xs p-6 lg:block hidden sticky top-24">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-xl font-bold text-on-surface mb-3">Your Account</CardTitle>
            <UserCard user={user.user} />
          </CardHeader>
          <div className="h-px bg-outline-variant/30 my-4" />
          <CardContent className="p-0 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathName === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3.5 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-primary-container text-on-primary-container shadow-xs font-bold"
                      : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-on-primary-container" : "text-outline"} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        {/* Mobile & Tablet Navigation Bar */}
        {user.isLoggedIn && (
          <div className="w-full lg:hidden flex gap-2 overflow-x-auto pb-2 border-b border-outline-variant/30 custom-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathName === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-primary-container text-on-primary-container shadow-xs"
                      : "bg-surface-container-lowest text-on-surface-variant border border-outline-variant/40"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Main Content Area */}
        {user.isLoggedIn && <div className="w-full flex-1 min-w-0">{children}</div>}

        {/* Logged Out Fallback State */}
        {!user.isLoggedIn && (
          <div className="w-full flex-1 flex items-center justify-center min-h-125 bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-8 text-center shadow-xs">
            <div className="max-w-md flex flex-col items-center gap-5">
              <div className="w-24 h-24 rounded-full bg-primary-container/30 flex items-center justify-center text-primary mb-2">
                <User size={48} className="text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-on-surface">Account Authentication Required</h1>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Please log in to your BookKart account to view your personal profile, track orders, manage your listings, and access your saved wishlist.
              </p>
              <Button
                className="bg-primary hover:bg-primary-fixed-dim text-on-primary font-bold px-8 py-3 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2 mt-2"
                onClick={() => dispatch(toggleLoginDialog())}
              >
                <LogIn size={18} />
                <span>Log In / Register</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

