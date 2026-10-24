import { Link } from "@tanstack/react-router";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
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
import { getLeadAttribution } from "@/lib/lead-attribution";
import { getLearningCourse, learningContinuation } from "@/lib/featured-learning";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    turnstile?: {
      render: (
        target: HTMLElement,
        options: {
          sitekey: string;
          action: string;
          theme: "auto";
          size: "flexible";
          appearance: "interaction-only";
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
        },
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

interface LeadFormProps {
  hideIntroduction?: boolean;
  requestContext?: string;
  externalCourseId?: string;
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
type ErrorField =
  "name" | "phone" | "email" | "state" | "program" | "contactChannel" | "consent" | "form" | null;
const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

type IntakeResponse = {
  ok: boolean;
  continueUrl?: string;
  reason?: "duplicate" | "rate_limited" | "unavailable" | "verification_failed" | "invalid";
};

const TURNSTILE_SITE_KEY = import.meta.env["VITE_TURNSTILE_SITE_KEY"] as string | undefined;
const turnstileConfigured = Boolean(TURNSTILE_SITE_KEY);

const contactChannels: { value: ContactChannel; label: string; icon: typeof Phone }[] = [
  { value: "call", label: "Call", icon: Phone },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { value: "email", label: "Email", icon: Mail },
];

export function LeadForm({
  hideIntroduction = false,
  requestContext,
  externalCourseId,
  title = "Speak with a course counsellor",
  description = "Ask about fees, eligibility or how to compare universities. A real person will respond on the channel you choose.",
  defaultProgramSlug,
  defaultUniversitySlug,
  compact = false,
  className,
  showMatchQuestions = false,
}: LeadFormProps) {
  const externalCourse = getLearningCourse(externalCourseId);
  const shortForm = compact && !externalCourse;
  const formId = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [locationState, setLocationState] = useState("");
  const [highestQualification, setHighestQualification] = useState("");
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
  const [continueUrl, setContinueUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileKey, setTurnstileKey] = useState(0);
  const startedAt = useRef(Date.now());
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLSelectElement>(null);
  const programRef = useRef<HTMLSelectElement>(null);
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
    setContinueUrl(null);

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

    if (shortForm && !indianStates.includes(locationState)) {
      showError("state", "Choose your state or union territory.", () => stateRef.current?.focus());
      return;
    }
    if (shortForm && !selectedProgram) {
      showError("program", "Choose the degree you are interested in.", () =>
        programRef.current?.focus(),
      );
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

    if (turnstileConfigured && !turnstileToken) {
      showError("form", "Please complete the quick security check and try again.");
      return;
    }

    if (import.meta.env.PROD && !turnstileConfigured) {
      showError(
        "form",
        "Counselling requests are temporarily unavailable. Please email online@dekhocampus.com.",
      );
      return;
    }

    setSubmitting(true);
    const attribution = getLeadAttribution();
    const message = JSON.stringify({
      requestContext: requestContext?.slice(0, 300),
      role: showMatchQuestions && !shortForm ? role : undefined,
      concern: showMatchQuestions && !shortForm ? concern : undefined,
      state: shortForm ? locationState : undefined,
      highestQualification: shortForm ? highestQualification || undefined : undefined,
      requestedChannel: contactChannel,
      consentVersion: CONSENT_VERSION,
    });

    let response: IntakeResponse;
    try {
      const request = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name.trim(),
          externalCourseId: externalCourse?.id,
          phone: phone.trim(),
          email: email.trim(),
          universitySlug: selectedUniversity?.slug ?? null,
          programSlug: selectedProgram?.slug ?? null,
          sourcePath: attribution.path,
          message,
          contactChannel,
          consentGiven: consent,
          consentText: CONSENT_TEXT,
          consentVersion: CONSENT_VERSION,
          shareWithUniversity: Boolean(selectedUniversity && shareWithUniversity),
          universityShareConsentVersion:
            selectedUniversity && shareWithUniversity ? UNIVERSITY_SHARE_CONSENT_VERSION : null,
          universityShareConsentText:
            selectedUniversity && shareWithUniversity
              ? universityShareConsentText(selectedUniversity.name)
              : null,
          qualification: showMatchQuestions && !shortForm ? role : null,
          goal: showMatchQuestions && !shortForm ? concern : null,
          utmSource: attribution.utmSource || null,
          utmMedium: attribution.utmMedium || null,
          utmCampaign: attribution.utmCampaign || null,
          referrer: attribution.referrer || null,
          turnstileToken: turnstileToken || null,
          website,
          elapsedMs: Date.now() - startedAt.current,
        }),
      });
      const result = (await request.json()) as IntakeResponse;
      response = { ...result, ok: request.ok && result.ok === true };
    } catch {
      response = { ok: false, reason: "unavailable" };
    } finally {
      setSubmitting(false);
      if (turnstileConfigured) {
        setTurnstileToken("");
        setTurnstileKey((value) => value + 1);
      }
    }

    const approvedUrl = externalCourse ? learningContinuation(externalCourse.id, response) : null;
    if (!response.ok || (externalCourse && !approvedUrl)) {
      const messages: Record<NonNullable<IntakeResponse["reason"]>, string> = {
        duplicate: "We already received this enquiry. A second submission is not needed.",
        rate_limited: "Too many requests were received. Please wait a few minutes and try again.",
        verification_failed: "The security check expired. Please complete it again.",
        invalid: "Please review your details and try again.",
        unavailable:
          "We couldn't securely submit your enquiry. Please try again or email online@dekhocampus.com.",
      };
      showError("form", response.reason ? messages[response.reason] : messages.unavailable);
      return;
    }

    toast.success("Your counselling request has been received.", {
      description: `We’ll use ${contactChannel} for this requested response.`,
    });
    setSubmitted(true);
    setContinueUrl(approvedUrl);
    setErrorField(null);
    setName("");
    setPhone("");
    setEmail("");
    setLocationState("");
    setHighestQualification("");
    setContactChannel(null);
    setConsent(false);
    setShareWithUniversity(false);
    startedAt.current = Date.now();
  }

  if (externalCourse && submitted && continueUrl) {
    return (
      <div className="space-y-4 border-t border-border pt-4">
        <p role="status" className="text-sm font-semibold text-foreground">
          Enquiry saved. You can now visit {externalCourse.provider}.
        </p>
        <Button asChild className="w-full rounded-full">
          <a
            href={continueUrl}
            target="_blank"
            rel="noopener noreferrer"
            referrerPolicy="no-referrer"
          >
            Continue to {externalCourse.provider} <ArrowUpRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
        <p className="text-xs leading-6 text-muted-foreground">
          Opens the provider website in a new tab. DekhoCampus has not enrolled you or taken a
          payment. Your contact details are not included in this link.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border-t border-border py-6 md:py-7",
        shortForm && "lead-form-short",
        className,
      )}
    >
      {!externalCourse && !hideIntroduction && shortForm && (
        <div className="lead-short-intro">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      )}
      {!externalCourse && !hideIntroduction && !shortForm && (
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-[#edf2ff] px-3 py-1.5 text-xs font-extrabold text-[#2449ad] dark:bg-[#263653] dark:text-[#b9ceff]">
              <UsersRound className="h-3.5 w-3.5" />
              Free guidance from a person
            </div>
            <h2 className="mt-4 font-display text-xl font-extrabold tracking-[-0.035em]">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
          <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff1e7] text-[#a94300] dark:bg-[#3a2518] dark:text-[#ffad70] sm:flex">
            <ShieldCheck className="h-5 w-5" />
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate aria-busy={submitting} className="mt-6 space-y-4">
        {showMatchQuestions && !shortForm ? (
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
            <Label htmlFor={`${formId}-name`}>
              {shortForm ? "Your name *" : "Full name (required)"}
            </Label>
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
            <Label htmlFor={`${formId}-phone`}>
              {shortForm ? "Your mobile number *" : "Mobile number (required)"}
            </Label>
            <div className={shortForm ? "lead-phone-row" : undefined}>
              {shortForm && <span aria-hidden="true">+91</span>}
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

        {(!shortForm || contactChannel === "email") && (
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
        )}

        {shortForm && (
          <>
            <div className="lead-short-selects">
              <div>
                <Label htmlFor={`${formId}-state`}>Your state *</Label>
                <select
                  ref={stateRef}
                  id={`${formId}-state`}
                  name="state"
                  autoComplete="address-level1"
                  value={locationState}
                  required
                  aria-invalid={errorField === "state"}
                  aria-describedby={errorField === "state" ? `${formId}-error` : undefined}
                  onChange={(event) => {
                    setLocationState(event.target.value);
                    clearFieldError("state");
                  }}
                >
                  <option value="" disabled>
                    Select state
                  </option>
                  {indianStates.map((state) => (
                    <option key={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor={`${formId}-degree`}>Degree of interest *</Label>
                <select
                  ref={programRef}
                  id={`${formId}-degree`}
                  name="program"
                  value={program}
                  required
                  aria-invalid={errorField === "program"}
                  aria-describedby={errorField === "program" ? `${formId}-error` : undefined}
                  onChange={(event) => {
                    setProgram(event.target.value);
                    clearFieldError("program");
                  }}
                >
                  <option value="" disabled>
                    Select degree
                  </option>
                  {programCatalog.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <fieldset className="lead-qualification">
              <legend>
                Highest qualification <span>(optional)</span>
              </legend>
              <div>
                {["Class 12", "Graduate", "Post Graduate"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={highestQualification === item}
                    onClick={() =>
                      setHighestQualification(highestQualification === item ? "" : item)
                    }
                  >
                    {item}
                  </button>
                ))}
              </div>
            </fieldset>
          </>
        )}
        {!externalCourse && !shortForm && (
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
        )}

        <fieldset
          className={shortForm ? "lead-contact-preference" : undefined}
          aria-invalid={errorField === "contactChannel"}
          aria-describedby={
            errorField === "contactChannel"
              ? `${formId}-channel-help ${formId}-error`
              : `${formId}-channel-help`
          }
        >
          <legend className="text-xs font-bold text-foreground">
            {shortForm ? "Contact me by *" : "How should we respond? (required)"}
          </legend>
          <p
            id={`${formId}-channel-help`}
            className={cn(
              "mt-1 text-[11px] leading-5 text-muted-foreground",
              shortForm && "sr-only",
            )}
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

        {selectedUniversity && !shortForm ? (
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

        <div
          className={cn(
            "lead-consent flex items-start gap-3 rounded-xl border border-[#c9d8e8] bg-[#f4f8fd] p-3.5 text-xs leading-5 text-muted-foreground dark:border-[#284760] dark:bg-[#0e2435]",
            shortForm && "lead-consent-short",
          )}
        >
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

        {turnstileConfigured ? (
          <TurnstileWidget key={turnstileKey} onToken={setTurnstileToken} compact={shortForm} />
        ) : import.meta.env.PROD ? (
          <p role="alert" className="text-center text-xs font-semibold text-destructive">
            Secure enquiries are temporarily unavailable.
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={submitting || (import.meta.env.PROD && !turnstileConfigured)}
          className={cn(
            "w-full font-extrabold",
            shortForm
              ? "lead-submit-short bg-[#292bbb] text-white hover:bg-[#202294]"
              : "bg-[#f47b25] text-[#111827] hover:bg-[#d85f12]",
          )}
          size="lg"
        >
          {submitting
            ? "Sending…"
            : externalCourse
              ? "Submit enquiry & unlock provider link"
              : shortForm
                ? "Get Free Counselling"
                : "Request free counselling"}
          {shortForm && <ArrowRight size={17} />}
        </Button>

        <p className="flex items-center justify-center gap-2 text-center text-[11px] leading-5 text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#0d5cad]" />
          {externalCourse
            ? `No payment to DekhoCampus. ${externalCourse.pricing === "Free" ? "Listed as free; provider terms apply." : "The provider may charge a course fee."}`
            : "No payment is required. Your details are used only for the response you request."}
        </p>
      </form>
    </div>
  );
}

function TurnstileWidget({
  onToken,
  compact = false,
}: {
  onToken: (token: string) => void;
  compact?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !containerRef.current) return;

    const scriptId = "cloudflare-turnstile-script";
    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        action: "counselling_lead",
        theme: "auto",
        size: "flexible",
        appearance: "interaction-only",
        callback: onToken,
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
    };

    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    if (window.turnstile) renderWidget();
    else script.addEventListener("load", renderWidget, { once: true });

    return () => {
      script?.removeEventListener("load", renderWidget);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, [onToken]);

  return (
    <div
      className={compact ? "min-w-0" : "min-h-16 rounded-lg border border-border bg-background p-2"}
    >
      <div ref={containerRef} className="min-w-0" aria-label="Security verification" />
    </div>
  );
}
