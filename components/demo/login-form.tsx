"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon, LogInIcon, TriangleAlertIcon } from "lucide-react";
import { toast } from "sonner";
import { DEMO_USER_GROUPS, getDemoUser } from "@/config/demo";
import {
  createDemoSession,
  getLoginRedirectPath,
  useDemoHydrated,
  useDemoSession,
} from "@/lib/demo/demo-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Demo login form — DEMO AUTHENTICATION ONLY.
 * Credentials are never verified: selecting a demo role and submitting
 * creates the client-side demo session. Replace with production
 * authentication (OTP / password / SSO) in a later phase.
 */
export function LoginForm({ next }: { next?: string | null }) {
  const router = useRouter();
  const session = useDemoSession();
  const hydrated = useDemoHydrated();

  const [selectedId, setSelectedId] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("demo");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Already signed in → send the user straight to a validated panel target.
  React.useEffect(() => {
    if (hydrated && session) {
      router.replace(getLoginRedirectPath(session, next));
    }
  }, [hydrated, session, next, router]);

  if (hydrated && session) {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-14 text-center"
      >
        <Loader2Icon className="size-5 animate-spin text-primary" aria-hidden="true" />
        <p className="text-sm font-semibold">Signed in — opening your panel…</p>
      </div>
    );
  }

  const selectedUser = selectedId ? getDemoUser(selectedId) : null;

  const handleRoleChange = (value: string) => {
    const user = getDemoUser(value);
    setSelectedId(value);
    setEmail(user?.email ?? "");
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;

    if (!selectedUser) {
      setError("Select a demo role to continue.");
      return;
    }
    if (!email.trim()) {
      setError("Enter the demo email shown for the selected role.");
      return;
    }
    if (email.trim().toLowerCase() !== selectedUser.email) {
      setError(
        `This email does not match the selected demo role — use ${selectedUser.email} or pick the role again.`,
      );
      return;
    }

    setBusy(true);
    setError(null);
    // Small deliberate delay so the loading state is visible in the demo.
    await new Promise((resolve) => setTimeout(resolve, 350));
    createDemoSession(selectedUser);
    toast.success(`Welcome, ${selectedUser.name}`, {
      description: `${selectedUser.roleName} · demo session created`,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[0.625rem] font-semibold tracking-wider text-primary uppercase">
            Demo auth
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Sign in to the demo workspace. Choose a demo role — no real credentials are verified.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="demo-role">Demo role</Label>
        <Select value={selectedId} onValueChange={handleRoleChange}>
          <SelectTrigger id="demo-role" aria-label="Select demo role" className="w-full">
            <SelectValue placeholder="Select a demo role…" />
          </SelectTrigger>
          <SelectContent>
            {DEMO_USER_GROUPS.map((group) => (
              <SelectGroup key={group.id}>
                <SelectLabel>{group.label}</SelectLabel>
                {group.users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.roleName} — {user.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
        <p className="text-[0.6875rem] text-muted-foreground">
          14 demo roles across the platform panel and 3 demo hotels.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="demo-email">Email</Label>
        <Input
          id="demo-email"
          type="email"
          autoComplete="off"
          placeholder="name@demo.local"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError(null);
          }}
          aria-invalid={error !== null}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="demo-password">Password</Label>
        <Input
          id="demo-password"
          type="password"
          autoComplete="off"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <p className="text-[0.6875rem] text-muted-foreground">
          Demo access — any value is accepted, nothing is checked. This is not production
          authentication.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2.5 text-xs text-destructive"
        >
          <TriangleAlertIcon className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={busy} aria-busy={busy}>
        {busy ? (
          <Loader2Icon className="animate-spin" aria-hidden="true" />
        ) : (
          <LogInIcon aria-hidden="true" />
        )}
        {busy ? "Signing in…" : "Sign in to demo"}
      </Button>

      <p className="text-center text-[0.6875rem] leading-relaxed text-muted-foreground">
        Demo authentication only — session data stays in your browser and no passwords are sent
        anywhere.
      </p>
    </form>
  );
}
