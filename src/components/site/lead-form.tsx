import { Link } from "@tanstack/react-router";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  Check,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
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
import { getLeadAttribution } from "@/lib/lead-attribution";
import { cn } from "@/lib/utils";

interface LeadFormProps {
  title?: string;
  description?: string;
  defaultProgramSlug?: string;
  defaultUniversitySlug?: string;
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
] as const;

const CONSENT_VERSION = "counselling-2026.09";
const CONSENT_TEXT =
  "Use my submitted details to provide the counselling response I requested. I can withdraw permission at any time.";
const UNIVERSITY_SHARE_CONSENT_VERSION = "university-share-2026.09";
const universityShareConsentText = (universityName: string) =>
  `You may share these enquiry details only with ${universityName} for this request. This is optional and is not selected by default.`;
type ContactChannel = "call" | "whatsapp" | "email";
type ErrorField = "name" | "phone" | "email" | "contactChannel" | "consent" | "form" | null;

const contactChannels: { value: ContactChannel; label: string; icon: typeof Phone }[] = [
  { value: "call", label: "Call", icon: Phone },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { value: "email", label: "Email", icon: Mail },
];

export function LeadForm({
  title = "Talk to an online-degree counsellor",
  description = "Get fees, eligibility and a university shortlist from a DekhoCampus expert.",
  defaultProgramSlug,
  defaultUniversitySlug,
  compact = false,
  className,
  showMatchQuestions = false,
}: LeadFormProps) {
  const formId = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [program, setProgram] = useState(defaultProgramSlug ?? "");
  const [university, setUniversity] = useState(defaultUniversitySlug ?? "");
  const [role, setRole] = useState<"Student" | "Parent">("Student");
  const [concern, setConcern] = useState<(typeof concerns)[number]>(concerns[0]);
  const [contactChannel, setContactChannel] = useState<ContactChannel | null>(null);
  const [consent, setConsent] = useState(false);
  const [shareWithUniversity, setShareWithUniversity] = useState(false);
  const [website, setWebsite] = useState("");
  const [formError, setFormError] = useState("");
  const [errorField, setErrorField] = useState<ErrorField>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const startedAt = useRef(Date.now());
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const contactChannelRef = useRef<HTMLButtonElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const formErrorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    setProgram(defaultProgramSlug ?? "");
  }, [defaultProgramSlug]);

  useEffect(() => {
    setUniversity(defaultUniversitySlug ?? "");
    setShareWithUniversity(false);
  }, [defaultUniversitySlug]);

  const selectedUniversity = universities.find((item) => item.slug === university);
  const selectedProgram = programCatalog.find((item) => item.slug === program);

  function clearFieldError(field: Exclude<ErrorField, "form" | null>) {
    if (errorField === field) {
      setErrorField(null);
      setFormError("");
    }
  }

  function showError(field: Exclude<ErrorField, null>, message: string, focus?: () => void) {
    setErrorField(field);
    setFormError(message);
    requestAnimationFrame(() => (focus ? focus() : formErrorRef.current?.focus()));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setErrorField(null);
    setSubmitted(false);

    if (website || Date.now() - startedAt.current < 900) {
      showError("form", "Please wait a moment and try again.");
      return;
    }

    if (name.trim().length < 2) {
      showError("name", "Please enter at least two characters for your name.", () =>
        nameRef.current?.focus(),
      );
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      showError("phone", "Please enter a valid 10-digit Indian mobile number.", () =>
        phoneRef.current?.focus(),
      );
      return;
    }

    if (email && !/^\S+@\S+\.\S+$/.test(email.trim())) {
      showError("email", "Please enter a valid email address.", () => emailRef.current?.focus());
      return;
    }

    if (!contactChannel) {
      showError("contactChannel", "Choose how you would like us to respond.", () =>
        contactChannelRef.current?.focus(),
      );
      return;
    }

    if (contactChannel === "email" && !email.trim()) {
      showError("email", "Enter an email address or choose call or WhatsApp.", () =>
        emailRef.current?.focus(),
      );
      return;
    }

    if (!consent) {
      showError(
        "consent",
        "Please confirm that we may use your details for this counselling request.",
        () => consentRef.current?.focus(),
      );
      return;
    }

    setSubmitting(true);
    const attribution = getLeadAttribution();
    const message = JSON.stringify({
      role: showMatchQuestions ? role : undefined,
      concern: showMatchQuestions ? concern : undefined,
      requestedChannel: contactChannel,
      consentVersion: CONSENT_VERSION,
    });

    const { error: rpcError } = await supabase.rpc("submit_counselling_lead", {
      p_full_name: name.trim(),
      p_phone: phone.trim(),
      p_email: email.trim() || null,
      p_university_slug: selectedUniversity?.slug ?? null,
      p_program_slug: selectedProgram?.slug ?? null,
      p_source_path: attribution.path,
      p_message: message,
      p_contact_channels: [contactChannel],
      p_consent_given: consent,
      p_consent_text: CONSENT_TEXT,
      p_consent_version: CONSENT_VERSION,
      p_share_with_university: Boolean(selectedUniversity && shareWithUniversity),
      p_university_share_consent_version:
        selectedUniversity && shareWithUniversity ? UNIVERSITY_SHARE_CONSENT_VERSION : null,
      p_university_share_consent_text:
        selectedUniversity && shareWithUniversity
          ? universityShareConsentText(selectedUniversity.name)
          : null,
      p_qualification: showMatchQuestions ? role : null,
      p_goal: showMatchQuestions ? concern : null,
      p_utm_source: attribution.utmSource || null,
      p_utm_medium: attribution.utmMedium || null,
      p_utm_campaign: attribution.utmCampaign || null,
      p_referrer: attribution.referrer || null,
    });

    setSubmitting(false);

    if (rpcError) {
      const duplicate = rpcError.message.includes("duplicate_recent_enquiry");
      showError(
        "form",
        duplicate
          ? "We already received this enquiry. A second submission is not needed."
          : "We couldn't securely submit your enquiry. Please try again or email online@dekhocampus.in.",
      );
      return;
    }

    toast.success("Your counselling request has been received.", {
      description: `We’ll use ${contactChannel} for this requested response.`,
    });
    setSubmitted(true);
    setErrorField(null);
    setName("");
    setPhone("");
    setEmail("");
    setContactChannel(null);
    setConsent(false);
    setShareWithUniversity(false);
    startedAt.current = Date.now();
  }

  return (
    <div
      className={cn("rounded-2xl border border-border bg-card p-6 shadow-card md:p-7", className)}
    >
      <div className="flex items-start justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-[#eaf3ff] px-3 py-1.5 text-xs font-extrabold text-[#0d5cad] dark:bg-[#102a42] dark:text-[#78b9ff]">
            <Sparkles className="h-3.5 w-3.5" />
            Free personalised guidance
          </div>
          <h2 className="mt-4 font-display text-xl font-extrabold tracking-[-0.035em]">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff1e7] text-[#a94300] dark:bg-[#3a2518] dark:text-[#ffad70] sm:flex">
          <ShieldCheck className="h-5 w-5" />
        </span>
      </div>

      <form onSubmit={handleSubmit} noValidate aria-busy={submitting} className="mt-6 space-y-4">
        {showMatchQuestions ? (
          <>
            <fieldset>
              <legend className="text-xs font-bold uppercase tracking-[0.12em] text-[#656a64] dark:text-[#aeb6ad]">
                Your main concern
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {concerns.map((item) => {
                  const selected = concern === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setConcern(item)}
                      className={cn(
                        "inline-flex min-h-10 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        selected
                          ? "border-[#0d5cad] bg-[#0d5cad] text-white dark:border-[#70b3ff] dark:bg-[#153a5e]"
                          : "border-border bg-background text-muted-foreground hover:border-[#a9c4e3] hover:text-foreground",
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
              <legend className="text-xs font-bold uppercase tracking-[0.12em] text-[#656a64] dark:text-[#aeb6ad]">
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
                      aria-pressed={selected}
                      onClick={() => setRole(item.value)}
                      className={cn(
                        "flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        selected
                          ? "border-[#0d5cad] bg-[#eaf3ff] text-[#0d5cad] dark:border-[#70b3ff] dark:bg-[#153a5e] dark:text-[#78b9ff]"
                          : "border-border bg-background text-muted-foreground hover:border-[#a9c4e3] hover:text-foreground",
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
            <Label htmlFor={`${formId}-name`}>Full name (required)</Label>
            <Input
              ref={nameRef}
              id={`${formId}-name`}
              name="full-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                clearFieldError("name");
              }}
              placeholder="Rahul Sharma"
              autoComplete="name"
              required
              minLength={2}
              maxLength={100}
              aria-invalid={errorField === "name"}
              aria-describedby={errorField === "name" ? `${formId}-error` : undefined}
              className="border-border bg-background"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${formId}-phone`}>Mobile number (required)</Label>
            <Input
              ref={phoneRef}
              id={`${formId}-phone`}
              name="mobile-number"
              type="tel"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value.replace(/\D/g, "").slice(0, 10));
                clearFieldError("phone");
              }}
              placeholder="9876543210"
              inputMode="numeric"
              autoComplete="tel"
              required
              maxLength={10}
              pattern="[6-9][0-9]{9}"
              aria-invalid={errorField === "phone"}
              aria-describedby={errorField === "phone" ? `${formId}-error` : undefined}
              className="border-border bg-background"
            />
          </div>
        </div>

        <div className="hidden" aria-hidden="true">
          <Label htmlFor={`${formId}-website`}>Website</Label>
          <Input
            id={`${formId}-website`}
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${formId}-email`}>
            Email {contactChannel === "email" ? "(required for email response)" : "(optional)"}
          </Label>
          <Input
            ref={emailRef}
            id={`${formId}-email`}
            name="email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              clearFieldError("email");
            }}
            placeholder="you@email.com"
            autoComplete="email"
            required={contactChannel === "email"}
            maxLength={254}
            aria-invalid={errorField === "email"}
            aria-describedby={errorField === "email" ? `${formId}-error` : undefined}
            className="border-border bg-background"
          />
        </div>

        <div className={cn("grid min-w-0 gap-4", compact ? "" : "sm:grid-cols-2")}>
          <div className="min-w-0 space-y-1.5">
            <Label htmlFor={`${formId}-program`}>Program of interest (optional)</Label>
            <Select name="program" value={program} onValueChange={setProgram}>
              <SelectTrigger
                id={`${formId}-program`}
                className="w-full min-w-0 border-border bg-background"
              >
                <SelectValue placeholder="Select a program" />
              </SelectTrigger>
              <SelectContent>
                {programCatalog.map((item) => (
                  <SelectItem key={item.slug} value={item.slug}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-0 space-y-1.5">
            <Label htmlFor={`${formId}-university`}>Preferred university (optional)</Label>
            <Select
              name="university"
              value={university}
              onValueChange={(value) => {
                setUniversity(value);
                setShareWithUniversity(false);
              }}
            >
              <SelectTrigger
                id={`${formId}-university`}
                className="w-full min-w-0 border-border bg-background"
              >
                <SelectValue placeholder="Not decided yet" />
              </SelectTrigger>
              <SelectContent>
                {universities.map((item) => (
                  <SelectItem key={item.slug} value={item.slug}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <fieldset
          aria-invalid={errorField === "contactChannel"}
          aria-describedby={
            errorField === "contactChannel"
              ? `${formId}-channel-help ${formId}-error`
              : `${formId}-channel-help`
          }
        >
          <legend className="text-xs font-bold text-foreground">
            How should we respond? (required)
          </legend>
          <p
            id={`${formId}-channel-help`}
            className="mt-1 text-[11px] leading-5 text-muted-foreground"
          >
            Choose one channel for this enquiry. This does not subscribe you to promotional
            messages.
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {contactChannels.map((item, index) => {
              const selected = contactChannel === item.value;
              return (
                <button
                  ref={index === 0 ? contactChannelRef : undefined}
                  key={item.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setContactChannel(item.value);
                    clearFieldError("contactChannel");
                    if (item.value !== "email") clearFieldError("email");
                  }}
                  className={cn(
                    "flex min-h-11 items-center justify-center gap-1.5 rounded-xl border px-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    selected
                      ? "border-[#1768cc] bg-[#eaf3ff] text-[#0d5cad] dark:border-[#70b3ff] dark:bg-[#153a5e] dark:text-[#8bc7ff]"
                      : "border-border bg-background text-muted-foreground hover:border-[#9cbddd] hover:text-foreground",
                  )}
                >
                  <item.icon className="h-3.5 w-3.5" /> {item.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        {selectedUniversity ? (
          <label
            htmlFor={`${formId}-university-sharing`}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-secondary/35 p-3.5 text-xs leading-5 text-muted-foreground"
          >
            <input
              id={`${formId}-university-sharing`}
              name="share-with-university"
              type="checkbox"
              checked={shareWithUniversity}
              onChange={(event) => setShareWithUniversity(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#1768cc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
            <span>{universityShareConsentText(selectedUniversity.name)}</span>
          </label>
        ) : null}

        <div className="flex items-start gap-3 rounded-xl border border-[#c9d8e8] bg-[#f4f8fd] p-3.5 text-xs leading-5 text-muted-foreground dark:border-[#284760] dark:bg-[#0e2435]">
          <input
            ref={consentRef}
            id={`${formId}-consent`}
            name="counselling-consent"
            type="checkbox"
            checked={consent}
            onChange={(event) => {
              setConsent(event.target.checked);
              clearFieldError("consent");
            }}
            required
            aria-invalid={errorField === "consent"}
            aria-describedby={errorField === "consent" ? `${formId}-error` : undefined}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#1768cc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          />
          <span>
            <label htmlFor={`${formId}-consent`} className="cursor-pointer">
              {CONSENT_TEXT}
            </label>{" "}
            See the{" "}
            <Link
              to="/privacy"
              className="font-bold text-[#1768cc] underline-offset-2 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-[#78b9ff]"
            >
              privacy notice
            </Link>
            .
          </span>
        </div>

        {formError ? (
          <p
            ref={formErrorRef}
            id={`${formId}-error`}
            role="alert"
            tabIndex={-1}
            className="rounded-xl border border-red-300 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-700 outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            {formError}
          </p>
        ) : null}

        {submitted ? (
          <p
            role="status"
            className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            Enquiry received. We’ll use only your chosen response channel.
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-[#a94300] font-extrabold text-white shadow-[0_14px_28px_-16px_rgba(169,67,0,0.72)] hover:bg-[#8f3700]"
          size="lg"
        >
          {submitting ? "Sending…" : "Request free counselling"}
        </Button>

        <p className="flex items-center justify-center gap-2 text-center text-[11px] leading-5 text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#0d5cad]" />
          No payment is required. Your details are used only for the response you request.
        </p>
      </form>
    </div>
  );
}
