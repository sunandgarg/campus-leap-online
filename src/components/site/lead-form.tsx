import { useId, useState, type FormEvent } from "react";
import { Check, ShieldCheck, Sparkles, UserRound, UsersRound } from "lucide-react";
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
  showMatchQuestions?: boolean;
}

const concerns = [
  "Choosing a program",
  "Fees & EMI",
  "Career clarity",
  "Admission process",
  "Compare universities",
];

export function LeadForm({
  title = "Talk to an online-degree counsellor",
  description = "Get fees, eligibility and a university shortlist from a DekhoCampus expert.",
  defaultProgram,
  defaultUniversity,
  compact = false,
  className,
  showMatchQuestions = false,
}: LeadFormProps) {
  const formId = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [program, setProgram] = useState(defaultProgram ?? "");
  const [university, setUniversity] = useState(defaultUniversity ?? "");
  const [role, setRole] = useState<"Student" | "Parent">("Student");
  const [concern, setConcern] = useState(concerns[0]);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

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
      const pathname = typeof window === "undefined" ? "/" : window.location.pathname;
      const sourceDetails = showMatchQuestions
        ? `${pathname}?role=${encodeURIComponent(role)}&concern=${encodeURIComponent(concern)}`
        : pathname;

      const { error } = await supabase.from("leads").insert({
        full_name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        university_slug:
          universities.find((item) => item.name === university)?.slug ?? null,
        program_slug: programCatalog.find((item) => item.name === program)?.slug ?? null,
        source_path: sourceDetails,
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
      <div className="flex items-start justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#eaf3ff] px-3 py-1.5 text-xs font-extrabold text-[#0d5cad]">
            <Sparkles className="h-3.5 w-3.5" />
            Free personalised guidance
          </div>
          <h3 className="mt-4 font-display text-xl font-extrabold tracking-[-0.035em]">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff1e7] text-[#f47a20] sm:flex">
          <ShieldCheck className="h-5 w-5" />
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {showMatchQuestions ? (
          <>
            <fieldset>
              <legend className="text-xs font-bold uppercase tracking-[0.12em] text-[#7b807a]">
                Your main concern
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {concerns.map((item) => {
                  const selected = concern === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setConcern(item)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-bold transition",
                        selected
                          ? "border-[#0d5cad] bg-[#0d5cad] text-white"
                          : "border-[#dde2db] bg-white text-[#5f645e] hover:border-[#a9c4e3]",
                      )}
                    >
                      {selected ? <Check className="h-3.5 w-3.5" /> : null}
                      {item}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-xs font-bold uppercase tracking-[0.12em] text-[#7b807a]">
                I am a
              </legend>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  { value: "Student" as const, icon: UserRound },
                  { value: "Parent" as const, icon: UsersRound },
                ].map((item) => {
                  const selected = role === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setRole(item.value)}
                      className={cn(
                        "flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-bold transition",
                        selected
                          ? "border-[#0d5cad] bg-[#eaf3ff] text-[#0d5cad]"
                          : "border-[#dde2db] bg-white text-[#5f645e] hover:border-[#a9c4e3]",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.value}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </>
        ) : null}

        <div className={cn("grid gap-4", compact ? "" : "sm:grid-cols-2")}>
          <div className="space-y-1.5">
            <Label htmlFor={`${formId}-name`}>Full name</Label>
            <Input
              id={`${formId}-name`}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Rahul Sharma"
              autoComplete="name"
              className="h-11 rounded-xl border-[#d9ded7] bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${formId}-phone`}>Mobile number</Label>
            <Input
              id={`${formId}-phone`}
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="9876543210"
              inputMode="numeric"
              autoComplete="tel"
              className="h-11 rounded-xl border-[#d9ded7] bg-white"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${formId}-email`}>Email (optional)</Label>
          <Input
            id={`${formId}-email`}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
            className="h-11 rounded-xl border-[#d9ded7] bg-white"
          />
        </div>

        <div className={cn("grid gap-4", compact ? "" : "sm:grid-cols-2")}>
          <div className="space-y-1.5">
            <Label>Program of interest</Label>
            <Select value={program} onValueChange={setProgram}>
              <SelectTrigger className="h-11 rounded-xl border-[#d9ded7] bg-white">
                <SelectValue placeholder="Select a program" />
              </SelectTrigger>
              <SelectContent>
                {programCatalog.map((item) => (
                  <SelectItem key={item.slug} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Preferred university</Label>
            <Select value={university} onValueChange={setUniversity}>
              <SelectTrigger className="h-11 rounded-xl border-[#d9ded7] bg-white">
                <SelectValue placeholder="Not decided yet" />
              </SelectTrigger>
              <SelectContent>
                {universities.map((item) => (
                  <SelectItem key={item.slug} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="h-12 w-full rounded-full bg-[#f47a20] font-extrabold text-white shadow-[0_14px_28px_-16px_rgba(244,122,32,0.8)] hover:bg-[#dd6818]"
          size="lg"
        >
          {submitting ? "Sending…" : "Book my free session"}
        </Button>

        <p className="flex items-center justify-center gap-2 text-center text-[11px] leading-5 text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#0d5cad]" />
          Your information is secure. No payment is required.
        </p>
      </form>
    </div>
  );
}
