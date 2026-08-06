"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  LogOut,
  Menu,
} from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setAdminDashboard } from "@/store/slice/adminSlice";

const navItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Orders", href: "/admin/orders", icon: ClipboardList },
];

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchingDashboardDetail();
  }, []);

  const fetchingDashboardDetail = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/order-dashboard`);
      const data = await response.json();
      if (data.isSuccess) {
        dispatch(setAdminDashboard(data.data));
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-surface-bright text-[#191c1d] flex overflow-hidden h-screen">
      {/* ── Sidebar ── */}
      <aside className="hidden md:flex flex-col w-64 h-full fixed left-0 top-0 bottom-0 bg-surface-container border-r border-outline-variant z-40">
        {/* Logo */}
        <div className="px-4 pt-5 pb-4 flex items-center justify-between">
          <Link href="/admin/dashboard">
            <span className="text-xl font-bold text-surface-tint tracking-tight select-none">
              BookKart
            </span>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 flex flex-col gap-1 mt-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-primary-container text-on-primary-container"
                    : "text-on-surface-variant hover:bg-[#e1e3e4]"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer — User */}
        <div className="mt-auto border-t border-outline-variant px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#e1e3e4] flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhaiBVuvbgbZ3bZhiHtybStMzVYGtLmxJro-P2fMTdrhPS3pHgvbxxFkPbtwxAAV9RQ53_4t8NEmXdg4NuW4UgJQLtUcO29Zd3fWYMcn66DJ0yx4BTtHAG2pJRKfxuy33xgG2SP0a2LzIakcdb9wb08vnSTFVqaw879X0XsXqvW3Wkna5f6wmUfnshHnaEy70sHsYQUScI08RVB8-_juV6XMWImjXZFMZ7uVpfvvICs2sODSzG1avo"
              alt="Admin avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#191c1d] truncate">
              Admin Panel
            </p>
            <p className="text-xs text-on-surface-variant truncate">Admin User</p>
          </div>
          <button
            type="button"
            aria-label="Logout"
            className="ml-auto text-on-surface-variant hover:text-error transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col md:ml-64 h-screen overflow-hidden">
        {/* Top App Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-outline-variant px-4 md:px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger — purely presentational */}
            <button
              type="button"
              aria-label="Open menu"
              className="md:hidden p-2 rounded-full text-[#191c1d] hover:bg-[#e1e3e4] transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-[#191c1d] tracking-tight">
              Admin Dashboard
            </h1>
          </div>
        </header>

        {/* Mobile Nav Tabs */}
        <div className="md:hidden border-b border-outline-variant bg-white px-4 py-2 flex gap-2 overflow-x-auto shrink-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border-primary-container bg-primary-container/10 text-on-primary-container"
                    : "border-outline-variant text-on-surface-variant"
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
