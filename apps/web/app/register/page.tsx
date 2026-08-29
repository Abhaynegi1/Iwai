"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, Sparkles } from "lucide-react";
import { useAuth } from "../../lib/auth-context";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      await register({ name, email, password });
      router.push("/dashboard");
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 bg-warm-100 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-forest-light blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-6 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest shadow-sm group-hover:scale-105 transition-transform duration-200">
            <Camera className="h-5 w-5 text-surface" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-ink font-serif">IWAI</span>
        </Link>
        <h2 className="text-center text-3xl font-bold tracking-tight text-ink font-serif">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-ink-secondary">
          Start hosting private, shared galleries for your weddings, parties, and celebrations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="rounded-3xl border border-warm-300 bg-surface p-8 shadow-[0_8px_30px_rgba(18,60,53,0.06)]">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl border border-coral/30 bg-coral/10 p-3 text-sm text-coral">
                {error}
              </div>
            )}

            <div>
              <Input
                label="Full Name"
                type="text"
                required
                placeholder="Sarah Jenkins"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <Input
                label="Email address"
                type="email"
                required
                placeholder="sarah@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Input
                label="Password"
                type="password"
                required
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                hint="Must be at least 8 characters"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={loading}
            >
              <Sparkles className="h-4 w-4" />
              Create Organizer Account
            </Button>
          </form>

          <div className="mt-6 border-t border-warm-300/80 pt-6 text-center text-sm text-ink-secondary">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-forest hover:text-forest-hover underline underline-offset-2 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
