interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta: { changes?: number };
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(column?: string): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run<T = Record<string, unknown>>(): Promise<D1Result<T>>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
}

interface R2ObjectBody {
  body: ReadableStream;
  httpEtag: string;
  httpMetadata?: { contentType?: string };
}

interface R2Bucket {
  get(key: string): Promise<R2ObjectBody | null>;
}

interface CloudflareEnv {
  CATALOG_DB: D1Database;
  ASSET_BUCKET?: R2Bucket;
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_POLICY_AUD?: string;
  TURNSTILE_ALLOWED_HOSTNAMES?: string;
  TURNSTILE_SECRET_KEY?: string;
  LEAD_BUCKET_SECRET?: string;
}

interface CacheStorage {
  default: Cache;
}

declare module "cloudflare:workers" {
  export const env: CloudflareEnv;
  export function waitUntil(promise: Promise<unknown>): void;
}
