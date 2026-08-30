"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, PlusCircle } from "lucide-react";
import { useAuth } from "../../lib/auth-context";
import { Button } from "../ui/Button";
import { Logo } from "../ui/Logo";

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/register";
  if (isAuthPage) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-warm-300 bg-warm-100/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center group py-1">
          <Logo className="h-8 w-auto text-forest transition-opacity duration-200 group-hover:opacity-80" />
        </Link>

        {/* Center Nav (marketing) */}
        {!pathname?.startsWith("/dashboard") && !pathname?.startsWith("/events") && (
          <nav className="hidden md:flex items-center gap-9 text-sm font-medium text-ink-secondary">
            <Link
              href="#how-it-works"
              className="hover:text-ink transition-colors"
            >
              Events
            </Link>
            <Link
              href="#features"
              className="hover:text-ink transition-colors"
            >
              About
            </Link>
            <Link
              href="#pricing"
              className="hover:text-ink transition-colors"
            >
              Pricing
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
              <div className="flex items-center gap-2 border-l border-warm-300 pl-3">
                <span className="text-xs font-medium text-ink-secondary hidden lg:inline-block">
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  title="Log out"
                  className="rounded-lg p-2 text-ink-muted hover:bg-warm-200 hover:text-ink transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:inline-block text-sm font-medium text-ink-secondary hover:text-ink transition-colors px-2"
              >
                Sign In
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-full px-5 py-2 bg-forest text-surface font-medium hover:bg-forest-hover shadow-sm transition-all text-sm">
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
