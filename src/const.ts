export const COOKIE_NAME = "tte_session";
export const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

function generateNonce(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, "0")).join("");
}

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL?.trim();
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = generateNonce();

  try {
    // `/app-auth` is served by the external OAuth portal (e.g. Manus), not this SPA.
    // Same-origin `/app-auth` always 404s — use /login (email/password, Google) instead.
    if (!oauthPortalUrl) {
      return "/login";
    }
    const url = new URL("/app-auth", oauthPortalUrl);
    if (appId) {
      url.searchParams.set("appId", appId);
    }
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");

    return url.toString();
  } catch {
    // Prevent runtime crash if env URL is malformed.
    return "/login";
  }
};
