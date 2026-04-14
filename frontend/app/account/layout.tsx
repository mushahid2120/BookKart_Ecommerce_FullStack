"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserCard from "@/components/UserCard";
import { RootState } from "@/store/store";
import { BookOpen, Heart, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useSelector((state: RootState) => state.user.user);
  const pathName=usePathname();
  console.log(pathName)
  return (
    <main className="md:px-16 sm:px-14  px-10 py-4 bg-[#f9fafb] flex gap-8">
      <Card className="w-full max-w-82.5 p-8 bg-[#8a55f1] text-white gap-0 lg:flex hidden">
        <CardTitle className="text-2xl">Your Account</CardTitle>
        <CardHeader className="p-0 hover:bg-inherit">
          <UserCard user={user} />
        </CardHeader>
        <hr />
        <CardContent className="space-y-4 mt-4 w-full p-0">
            <Link href="/account/profile" className={`flex gap-4 items-center py-2.5 px-3 w-full text-sm font-medium ${pathName==="/account/profile" && "  rounded-md bg-linear-to-r from-[#ec4899] to-[#f43f5f]" }`}><User size={20}/><span>My Profile</span></Link>
            <Link href="/account/order" className={`flex gap-4   items-center py-2.5 px-3 w-full text-sm font-medium ${pathName==="/account/order" && "rounded-md bg-linear-to-r from-[#f97316] to-[#f69e0c]"}`}><ShoppingCart size={20}/><span>My Orders</span></Link>
            <Link href="/account/selling-products" className={`flex gap-4    items-center py-2.5 px-3 w-full text-sm font-medium ${pathName==="/account/selling-products" && " rounded-md bg-linear-to-r from-[#22c55e] to-[#10b981]"}`}><BookOpen size={20}/><span>Selling Products</span></Link>
            <Link href="/account/wishlist" className={`flex gap-4 items-center py-2.5 px-3 w-full text-sm font-medium ${pathName==="/account/wishlist" && "rounded-md bg-linear-to-r from-[#ef4444] to-[#ec4898]"}`}><Heart size={20}/><span>Wishlist</span></Link>
        </CardContent>
      </Card>
      <div className="w-full">{children}</div>
    </main>
  );
}
