import "./lib/error-capture";

import { env, waitUntil } from "cloudflare:workers";
import { renderErrorPage } from "./lib/error-page";
import { hasAdminAccess, isProtectedAdminPath } from "./lib/admin-access";
import { universityLogoUrls } from "./data/directory-universities";
import bundledLogos from "./data/bundled-university-logos.json";

const bundledMedia = new Map(
  Object.entries(universityLogoUrls).flatMap(([slug, url]) => {
    const asset = (bundledLogos as Record<string, string>)[slug];
    return asset ? [[url, asset] as const] : [];
  }),
);

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "connect-src 'self' https://challenges.cloudflare.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src https://challenges.cloudflare.com",
  "img-src 'self' data: blob: https:",
  "manifest-src 'self'",
  "object-src 'none'",
  // TanStack Start serialises request-specific hydration state into inline
  // scripts. Keep that framework requirement explicit while preventing scripts
  // from every origin other than this app and Cloudflare Turnstile.
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ");

function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("Content-Security-Policy", CONTENT_SECURITY_POLICY);
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(
  request: Request,
  response: Response,
): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  const cfRay = request.headers.get("cf-ray")?.match(/^[a-zA-Z0-9-]{1,80}$/)?.[0] ?? "missing";
  console.error("ssr_response_failure", { cfRay, status: response.status });
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

function assetContentType(key: string) {
  if (key.endsWith(".svg")) return "image/svg+xml";
  if (key.endsWith(".webp")) return "image/webp";
  if (key.endsWith(".png")) return "image/png";
  if (key.endsWith(".jpg") || key.endsWith(".jpeg")) return "image/jpeg";
  if (key.endsWith(".pdf")) return "application/pdf";
  return "application/octet-stream";
}

async function serveR2Asset(request: Request): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", { status: 405 });
  }
  const pathname = new URL(request.url).pathname;
  const key = decodeURIComponent(pathname.slice("/media/".length));
  if (!key || key.includes("..") || !/^[a-zA-Z0-9][a-zA-Z0-9/_.-]*$/.test(key)) {
    return new Response("Not found", { status: 404 });
  }

  const bundled = bundledMedia.get(pathname);
  if (bundled) return Response.redirect(new URL(bundled, request.url), 308);
  if (!env.ASSET_BUCKET) return new Response("Not found", { status: 404 });
  const cached = await caches.default.match(request);
  if (cached) return cached;
  const object = await env.ASSET_BUCKET.get(key);
  if (!object) return new Response("Not found", { status: 404 });

  const response = new Response(request.method === "HEAD" ? null : object.body, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": object.httpMetadata?.contentType || assetContentType(key),
      ETag: object.httpEtag,
      "X-Content-Type-Options": "nosniff",
    },
  });
  if (request.method === "GET") waitUntil(caches.default.put(request, response.clone()));
  return response;
}

export default {
  async fetch(request: Request) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;
      const localDevelopment =
        import.meta.env.DEV && (url.hostname === "localhost" || url.hostname === "127.0.0.1");
      if (
        isProtectedAdminPath(pathname) &&
        !localDevelopment &&
        !(await hasAdminAccess(request, env))
      ) {
        return withSecurityHeaders(new Response("Cloudflare Access is required.", { status: 403 }));
      }
      if (pathname.startsWith("/media/")) return serveR2Asset(request);

      const handler = await getServerEntry();
      const response = await handler.fetch(request, undefined, undefined);
      return withSecurityHeaders(await normalizeCatastrophicSsrResponse(request, response));
    } catch (error) {
      console.error(error);
      return withSecurityHeaders(
        new Response(renderErrorPage(), {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
      );
    }
  },
};
