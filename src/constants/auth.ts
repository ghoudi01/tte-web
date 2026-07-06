export const UNAUTHED_ERR_MSG = "Unauthorized";
export const NOT_ADMIN_ERR_MSG = "Forbidden: Not an admin";

/** Same value server returns from `auth.login` — sent as `Authorization: Bearer` when cookies are unreliable cross-origin. */
export const SESSION_STORAGE_TOKEN_KEY = "tte_session_token";

/** Limits immediate `auth.me` refetch on route change overwriting hydrated cache. */
export const AUTH_ME_QUERY_OPTS = {
  retry: false,
  refetchOnWindowFocus: false,
  staleTime: 60 * 1000,
} as const;
