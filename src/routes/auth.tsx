import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandLogo } from "@/components/site/brand-logo";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin sign in | DekhoCampus Online" },
      {
        name: "description",
        content:
          "Sign in to manage universities, programs, fees and enquiries on DekhoCampus Online.",
      },
      { property: "og:title", content: "Admin sign in | DekhoCampus Online" },
      { property: "og:description", content: "Content management sign-in for DekhoCampus Online." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      navigate({ to: "/admin", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/auth" },
    });
    if (error) {
      toast.error("Google sign-in failed.");
      return;
    }
    if (data.url) window.location.assign(data.url);
  }

  return (
    <section className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-7 shadow-card">
        <BrandLogo size="lg" className="mb-7" />
        <h1 className="font-display text-2xl font-bold">Admin sign in</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Restricted to invited DekhoCampus administrators.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="auth-password">Password</Label>
            <Input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              minLength={6}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={busy}
            className="w-full bg-ink text-ink-foreground hover:bg-ink-soft"
          >
            Sign in
          </Button>
        </form>

        <Button variant="outline" className="mt-3 w-full" onClick={handleGoogle}>
          Continue with Google
        </Button>

        <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
          Need access? Ask an existing administrator to invite you and assign the appropriate role.
        </p>
      </div>
    </section>
  );
}
