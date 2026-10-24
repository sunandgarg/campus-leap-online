import { createRemoteJWKSet, jwtVerify } from "jose";

const keySets = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

export function isProtectedAdminPath(pathname: string) {
  try {
    for (let depth = 0; depth < 5; depth++) {
      const decoded = decodeURIComponent(pathname);
      if (decoded === pathname) break;
      pathname = decoded;
    }
  } catch {
    return true;
  }
  return /^\/(?:api\/)?admin(?:\/|$)/.test(pathname);
}

export async function hasAdminAccess(
  request: Request,
  settings: {
    ACCESS_TEAM_DOMAIN?: string;
    ACCESS_POLICY_AUD?: string;
  },
) {
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token || !settings.ACCESS_TEAM_DOMAIN || !settings.ACCESS_POLICY_AUD) return false;
  try {
    const domain = new URL(settings.ACCESS_TEAM_DOMAIN);
    if (
      domain.protocol !== "https:" ||
      !domain.hostname.endsWith(".cloudflareaccess.com") ||
      domain.pathname !== "/" ||
      domain.username ||
      domain.password ||
      domain.port
    )
      return false;
    const issuer = domain.origin;
    let keys = keySets.get(issuer);
    if (!keys) {
      keys = createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`));
      keySets.set(issuer, keys);
    }
    await jwtVerify(token, keys, {
      issuer,
      audience: settings.ACCESS_POLICY_AUD,
      algorithms: ["RS256"],
      requiredClaims: ["sub", "iat", "exp"],
    });
    return true;
  } catch {
    return false;
  }
}
