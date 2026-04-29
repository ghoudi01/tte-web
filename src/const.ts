export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL?.trim();
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  try {
    // Fall back to current origin when OAuth portal env var is missing.
    const url = new URL("/app-auth", oauthPortalUrl || window.location.origin);
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
