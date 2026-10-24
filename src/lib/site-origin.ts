const defaultOrigin = "https://online.dekhocampus.com";

function configuredOrigin(value: unknown) {
  try {
    const url = new URL(typeof value === "string" && value ? value : defaultOrigin);
    return ["https:", "http:"].includes(url.protocol) ? url.origin : defaultOrigin;
  } catch {
    return defaultOrigin;
  }
}

export const SITE_ORIGIN = configuredOrigin(import.meta.env["VITE_SITE_URL"]);
