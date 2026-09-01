"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../lib/auth-context";
import { Button } from "../ui/Button";
import { Logo } from "../ui/Logo";

export function Navbar() {
  const { user, logout, openProfileModal } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu whenever path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isAuthPage = pathname === "/login" || pathname === "/register";
  if (isAuthPage) return null;

  const isAppPage = pathname?.startsWith("/dashboard") || pathname?.startsWith("/events");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-warm-300 bg-warm-100/90 backdrop-blur-md transition-colors">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center group py-1 shrink-0 z-10"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Logo className="h-8 w-auto text-forest transition-opacity duration-200 group-hover:opacity-80" />
        </Link>

        {/* Center Nav (Marketing) - Absolutely centered on desktop so right actions don't push it */}
        {!isAppPage && (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-secondary absolute left-1/2 -translate-x-1/2">
            <Link
              href="#how-it-works"
              className="hover:text-ink transition-colors px-1 py-1"
            >
              How it works
            </Link>
            <Link
              href="#pricing"
              className="hover:text-ink transition-colors px-1 py-1"
            >
              Pricing
            </Link>
          </nav>
        )}

        {/* Right CTA / User Section */}
        <div className="flex items-center gap-2 sm:gap-3 z-10">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Desktop "+ New Event" Button */}
              <Link href="/events/new">
                <Button size="sm" variant="primary" className="hidden sm:inline-flex shadow-xs">
                  <PlusCircle className="h-4 w-4" />
                  <span>New Event</span>
                </Button>
              </Link>

              {/* Desktop Dashboard Button */}
              <Link href="/dashboard">
                <Button size="sm" variant="secondary" className="hidden md:inline-flex">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
              </Link>

              {/* User Avatar + Profile Button */}
              <div className="flex items-center gap-1 sm:gap-1.5 sm:border-l sm:border-warm-300 sm:pl-3">
                <button
                  type="button"
                  onClick={openProfileModal}
                  title="View & customize your profile"
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl hover:bg-warm-200 transition-colors group"
                >
                  <div className="h-8 w-8 sm:h-7 sm:w-7 rounded-full bg-forest/10 border border-forest/20 flex items-center justify-center text-xs font-bold text-forest overflow-hidden shrink-0 shadow-xs">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{user.name?.charAt(0).toUpperCase() || "O"}</span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-ink-secondary group-hover:text-ink hidden lg:inline-block max-w-[110px] truncate">
                    {user.name}
                  </span>
                </button>

                {/* Logout Button (Desktop) */}
                <button
                  onClick={logout}
                  title="Log out"
                  className="hidden md:flex rounded-lg p-2 text-ink-muted hover:bg-warm-200 hover:text-ink transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile Hamburger Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className="flex md:hidden p-2 rounded-xl text-ink-secondary hover:text-ink hover:bg-warm-200 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="hidden sm:inline-block text-sm font-medium text-ink-secondary hover:text-ink transition-colors px-2"
              >
                Sign In
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-full px-4 sm:px-5 py-2 bg-forest text-surface font-medium hover:bg-forest-hover shadow-xs transition-all text-xs sm:text-sm">
                  Get Started
                </Button>
              </Link>

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className="flex md:hidden p-2 rounded-xl text-ink-secondary hover:text-ink hover:bg-warm-200 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── Mobile Drawer Menu ──────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-warm-300 bg-surface/98 backdrop-blur-xl px-4 py-5 shadow-lg transition-all animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-4 max-w-md mx-auto">
            
            {/* Authenticated User Banner on Mobile */}
            {user ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-warm-100 border border-warm-300">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openProfileModal();
                  }}
                  className="flex items-center gap-3 text-left w-full"
                >
                  <div className="h-10 w-10 rounded-full bg-forest/10 border border-forest/20 flex items-center justify-center text-sm font-bold text-forest overflow-hidden shrink-0 shadow-xs">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{user.name?.charAt(0).toUpperCase() || "O"}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-ink-secondary truncate">
                      Tap to edit profile
                    </p>
                  </div>
                </button>
              </div>
            ) : null}

            {/* Navigation Links */}
            <div className="flex flex-col space-y-1 pt-1">
              <Link
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-medium text-ink hover:bg-warm-100 transition-colors"
              >
                <span>How it works</span>
              </Link>
              <Link
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-medium text-ink hover:bg-warm-100 transition-colors"
              >
                <span>Pricing</span>
              </Link>
            </div>

            <div className="border-t border-warm-300/80 pt-3 space-y-2">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-base font-medium text-ink hover:bg-warm-100 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4 text-forest" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    href="/events/new"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full"
                  >
                    <Button size="md" variant="primary" className="w-full justify-center">
                      <PlusCircle className="h-4 w-4" />
                      <span>Create New Event</span>
                    </Button>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-coral hover:bg-coral/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2 pt-1">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center py-2.5 px-4 rounded-xl text-sm font-medium text-ink hover:bg-warm-100 transition-colors border border-warm-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full"
                  >
                    <button className="w-full rounded-xl py-3 px-4 bg-forest hover:bg-forest-hover text-surface font-medium text-sm transition-all shadow-sm">
                      Get Started Free
                    </button>
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
