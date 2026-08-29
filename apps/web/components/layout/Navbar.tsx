"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Sparkles, LayoutDashboard, LogOut, PlusCircle } from "lucide-react";
import { useAuth } from "../../lib/auth-context";
import { Button } from "../ui/Button";

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/register";
  if (isAuthPage) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
            <Camera className="h-5 w-5 text-white" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold tracking-tight text-white">
              IWAI
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-400">
              PRO
            </span>
          </div>
        </Link>

        {/* Center Nav (marketing) */}
        {!pathname?.startsWith("/dashboard") && !pathname?.startsWith("/events") && (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link
              href="#how-it-works"
              className="hover:text-white transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#features"
              className="hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="hover:text-white transition-colors"
            >
              FAQ
            </Link>
          </nav>
        )}

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/events/new">
                <Button size="sm" variant="primary" className="hidden sm:inline-flex">
                  <PlusCircle className="h-4 w-4" />
                  New Event
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="sm" variant="secondary">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
                <span className="text-xs text-slate-400 hidden lg:inline-block">
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  title="Log out"
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link href="/login">
                <Button size="sm" variant="ghost">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" variant="primary">
                  <Sparkles className="h-4 w-4" />
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
