import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { MobileBottomNav } from "@/components/site/mobile-bottom-nav";
import { DekhoAICopilot } from "@/components/site/dekho-ai-copilot";
import { Toaster } from "@/components/ui/sonner";
import { getCatalog } from "@/lib/catalog.functions";
import { setCatalog, siteSettings } from "@/data/universities";

const SITE_ORIGIN = "https://online.dekhocampus.in";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This university or program page doesn't exist. Browse the online-university directory
          instead.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link
            to="/universities"
            className="inline-flex h-11 min-w-24 items-center justify-center rounded-xl bg-ink px-5 text-sm font-bold text-ink-foreground transition-colors hover:bg-ink-soft"
          >
            Browse universities
          </Link>
          <Link
            to="/"
            className="inline-flex h-11 min-w-24 items-center justify-center rounded-xl border border-input px-5 text-sm font-bold transition-colors hover:bg-accent"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex h-11 min-w-24 items-center justify-center rounded-xl bg-ink px-5 text-sm font-bold text-ink-foreground transition-colors hover:bg-ink-soft"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex h-11 min-w-24 items-center justify-center rounded-xl border border-input bg-background px-5 text-sm font-bold text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: ({ matches }) => {
    const pathname = matches.at(-1)?.pathname ?? "/";
    const canonicalPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
    const includeCanonical = !/^\/(?:admin|auth|search|sitemap\.xml)(?:\/|$)/.test(canonicalPath);

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "Online Degree Discovery & Comparison | DekhoCampus" },
        {
          name: "description",
          content:
            "Explore online degrees, compare source-checked catalogue facts, build a private shortlist and verify the exact intake before applying.",
        },
        { name: "author", content: "DekhoCampus" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "icon", href: "/dekhocampus-logo.png", type: "image/png" },
        { rel: "apple-touch-icon", href: "/dekhocampus-logo.png" },
        ...(includeCanonical ? [{ rel: "canonical", href: `${SITE_ORIGIN}${canonicalPath}` }] : []),
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        { rel: "preconnect", href: "https://challenges.cloudflare.com" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap",
        },
      ],
    };
  },
  beforeLoad: async () => {
    const catalog = await getCatalog();
    setCatalog(catalog);
    return { catalog };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('dekhocampus-theme');var d=t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function normaliseAnnouncement(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const record = value as Record<string, unknown>;
  if (record["enabled"] !== true || typeof record["text"] !== "string") return null;

  const text = record["text"].trim().slice(0, 280);
  if (!text) return null;

  return {
    text,
    cta: typeof record["cta"] === "string" ? record["cta"].trim().slice(0, 64) : "",
    href: typeof record["href"] === "string" ? record["href"].trim().slice(0, 512) : "",
  };
}

function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const announcement = normaliseAnnouncement(siteSettings["announcement"]);
  if (!announcement || !visible) return null;

  // Admin-entered announcements have no source date or inventory feed. Replace
  // time-sensitive pressure copy instead of presenting it as a verified fact.
  const unverifiableUrgency =
    /(?:limited|few|only)\s+(?:\d+\s+)?(?:seats?|spots?)|(?:seats?|spots?)\s+(?:left|filling)|last\s+chance|hurry|ending\s+soon|closes?\s+(?:today|tonight|soon)|deadline\s+in|countdown|offer\s+expires?|admissions?\s+(?:open|closing|closed)|applications?\s+(?:open|closing|closed)/i;
  const containsUnverifiableUrgency = unverifiableUrgency.test(
    `${announcement.text} ${announcement.cta ?? ""}`,
  );
  const text = containsUnverifiableUrgency
    ? "Admission dates and programme entitlement can change. Verify the current intake before applying."
    : announcement.text;
  const cta = containsUnverifiableUrgency ? "See verification steps" : announcement.cta;
  const safeConfiguredHref = getSafeInternalHref(announcement.href);
  const href = containsUnverifiableUrgency ? "/methodology" : safeConfiguredHref;

  return (
    <div
      role="region"
      aria-label="Site announcement"
      className="bg-ink px-3 py-2 text-xs text-ink-foreground/85 sm:text-sm"
    >
      <div className="container-page flex items-center justify-center gap-2">
        <span className="line-clamp-2 text-center sm:line-clamp-1">{text}</span>
        {cta ? (
          <a
            href={href}
            className="shrink-0 rounded-md font-semibold text-gold underline-offset-4 hover:underline"
          >
            {cta}
          </a>
        ) : null}
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Dismiss announcement"
          className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base leading-none text-ink-foreground/55 transition hover:bg-white/10 hover:text-white"
        >
          ×
        </button>
      </div>
    </div>
  );
}

function getSafeInternalHref(value: string | undefined) {
  const hasUnsafeCharacter = value
    ? [...value].some((character) => character === "\\" || character.charCodeAt(0) < 32)
    : false;

  if (!value || !value.startsWith("/") || value.startsWith("//") || hasUnsafeCharacter) {
    return "/contact";
  }

  try {
    const parsed = new URL(value, SITE_ORIGIN);
    return parsed.origin === SITE_ORIGIN
      ? `${parsed.pathname}${parsed.search}${parsed.hash}`
      : "/contact";
  } catch {
    return "/contact";
  }
}

function RootComponent() {
  const { queryClient, catalog } = Route.useRouteContext();

  // The server runs beforeLoad before nested loaders. During client hydration,
  // TanStack restores that context without rerunning beforeLoad, so synchronise
  // the transported catalogue before Outlet renders as well.
  setCatalog(catalog);

  return (
    <QueryClientProvider client={queryClient}>
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-foreground px-4 py-2 text-sm font-bold text-background transition focus:translate-y-0"
      >
        Skip to main content
      </a>
      <div className="flex min-h-screen flex-col pb-24 lg:pb-0">
        <AnnouncementBar />
        <SiteHeader />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {/* Required: nested routes render here. */}
          <Outlet />
        </main>
        <SiteFooter />
      </div>
      <MobileBottomNav />
      <DekhoAICopilot />
      <Toaster />
    </QueryClientProvider>
  );
}
