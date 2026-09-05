"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const [resentLoading, setResentLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  const handleResendConfirmation = async () => {
    setResentLoading(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (!error) {
      setResent(true);
    }
    setResentLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  const isEmailNotConfirmed = error?.includes("Email not confirmed");

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="font-display font-semibold text-display-xl text-ink mb-2">
          Welcome back
        </h1>
        <p className="text-body-md text-body">
          Sign in to MoneyTrail
        </p>
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <label className="block text-body-sm font-medium text-body mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-canvas-elevated border border-hairline rounded-md text-body-md text-ink placeholder:text-mute focus:outline-none focus:ring-1 focus:ring-ink focus:border-ink"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-body-sm font-medium text-body mb-1.5">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-canvas-elevated border border-hairline rounded-md text-body-md text-ink placeholder:text-mute focus:outline-none focus:ring-1 focus:ring-ink focus:border-ink"
            placeholder="••••••••"
            required
          />
        </div>

        {error && (
          <div className="space-y-2">
            <p className="text-body-sm text-error">{error}</p>
            {isEmailNotConfirmed && (
              <div>
                {resent ? (
                  <p className="text-body-sm text-link flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    Confirmation email sent! Check your inbox.
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    disabled={resentLoading}
                    className="text-body-sm text-link font-medium hover:underline disabled:opacity-50"
                  >
                    {resentLoading ? "Sending..." : "Resend confirmation email"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-ink text-on-primary font-button-lg rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="my-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-hairline" />
          </div>
          <div className="relative flex justify-center text-body-sm">
            <span className="px-2 bg-canvas text-mute">or</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="mt-4 w-full py-2 px-4 bg-canvas-elevated border border-hairline text-ink font-button-lg rounded-full hover:bg-hairline-soft transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>
      </div>

      <p className="text-center text-body-sm text-body">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-ink font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
