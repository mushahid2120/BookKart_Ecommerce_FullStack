"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  CreditCard,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, type ReactNode } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setAdminDashboard } from "@/store/slice/adminSlice";

const navItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Orders", href: "/admin/orders", icon: ClipboardList },];

const adminUser = {
  name: "Dheeraj Admin",
  email: "dheerajagrahari726@gmail.com",
};

const BASE_URL=process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const dispatch=useDispatch();
  
  useEffect(()=>{
      fetchingDashboardDetail()
  },[])

  const fetchingDashboardDetail=async ()=>{
    try {
      const response=await fetch(`${BASE_URL}/admin/order-dashboard`)
      const data=await response.json();
      if(data.isSuccess){
        dispatch(setAdminDashboard(data.data))
      }
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="min-h-screen bg-(--color-background) text-(--color-header-text)">
      <div className="flex min-h-screen">
        <aside className="hidden md:flex md:w-72 flex-col justify-between border-r border-(--color-header-border) bg-(--color-card) p-6">
          <div>
            <div className="mb-10">
              <Link
                href="/admin/dashboard"
                className="transition-transform hover:scale-105"
              >
                <Image
                  src="/Image/Logo.jpg"
                  width={200}
                  height={80}
                  loading="eager"
                  alt="Logo"
                  className="object-cover w-auto min-w-20"
                />
              </Link>
            </div>

            <div className="max-h-140">
              <div>
                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition-colors duration-150 ${
                          isActive
                            ? "bg-(--color-accent-yellow) text-black"
                            : "text-(--color-header-text) hover:bg-(--color-surface-muted)"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {item.title}
                      </Link>
                    );
                  })}
                </nav>
              </div>
                  <hr  className="pt-4"/>
              <div>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-3xl border border-(--color-header-border) bg-(--color-surface) px-4 py-3 text-left text-sm font-medium text-(--color-header-text) transition hover:bg-(--color-surface-muted)"
                >
                  <LogOut className="h-5 w-5 text-(--color-accent-yellow)" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="border-b border-(--color-header-border) bg-(--color-card)  p-2">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div></div>
            </div>
          </div>

          <div className="md:hidden border-b border-(--color-header-border) bg-(--color-card) p-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`shrink-0 rounded-3xl border px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "border-(--color-accent-yellow) bg-(--color-accent-yellow)/10 text-(--color-accent-yellow)"
                        : "border-(--color-header-border) text-(--color-header-text)"
                    }`}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>

          <main className="p-2 ">{children}</main>
        </div>
      </div>
    </div>
  );
}
