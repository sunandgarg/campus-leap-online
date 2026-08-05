import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { programCatalog, universities } from "@/data/universities";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface LeadFormProps {
  title?: string;
  description?: string;
  defaultProgram?: string;
  defaultUniversity?: string;
  compact?: boolean;
  className?: string;
}

export function LeadForm({
  title = "Talk to an online-degree counsellor",
  description = "Get fees, eligibility and a university shortlist on WhatsApp within 10 minutes.",
  defaultProgram,
  defaultUniversity,
  compact = false,
  className,
}: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [program, setProgram] = useState(defaultProgram ?? "");
  const [university, setUniversity] = useState(defaultUniversity ?? "");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      toast.error("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    void (async () => {
      const { error } = await supabase.from("leads").insert({
        full_name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        university_slug:
          universities.find((u) => u.name === university)?.slug ?? null,
        program_slug: programCatalog.find((p) => p.name === program)?.slug ?? null,
        source_path: typeof window === "undefined" ? null : window.location.pathname,
      });
      setSubmitting(false);
      if (error) {
        toast.error("We couldn't submit your enquiry. Please try again.");
        return;
      }
      toast.success("Thanks! A counsellor will call you shortly.", {
        description: `${name.trim()} · +91 ${phone.trim()}${program ? ` · ${program}` : ""}`,
      });
      setName("");
      setPhone("");
      setEmail("");
    })();
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-card md:p-7",
        className,
      )}
    >
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className={cn("grid gap-4", compact ? "" : "sm:grid-cols-2")}>
          <div className="space-y-1.5">
            <Label htmlFor="lead-name">Full name</Label>
            <Input
              id="lead-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Rahul Sharma"
              autoComplete="name"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lead-phone">Mobile number</Label>
            <Input
              id="lead-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="9876543210"
              inputMode="numeric"
              autoComplete="tel"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="lead-email">Email (optional)</Label>
          <Input
            id="lead-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
          />
        </div>

        <div className={cn("grid gap-4", compact ? "" : "sm:grid-cols-2")}>
          <div className="space-y-1.5">
            <Label>Program of interest</Label>
            <Select value={program} onValueChange={setProgram}>
              <SelectTrigger>
                <SelectValue placeholder="Select a program" />
              </SelectTrigger>
              <SelectContent>
                {programCatalog.map((p) => (
                  <SelectItem key={p.slug} value={p.name}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Preferred university</Label>
            <Select value={university} onValueChange={setUniversity}>
              <SelectTrigger>
                <SelectValue placeholder="Not decided yet" />
              </SelectTrigger>
              <SelectContent>
                {universities.map((u) => (
                  <SelectItem key={u.slug} value={u.name}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-ink text-ink-foreground hover:bg-ink-soft"
          size="lg"
        >
          {submitting ? "Sending…" : "Get free counselling"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          By submitting you agree to be contacted by DekhoCampus counsellors.
        </p>
      </form>
    </div>
  );
}
