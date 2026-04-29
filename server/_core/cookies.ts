import { COOKIE_NAME } from "@shared/const";

export type Req = { headers?: { cookie?: string }; [k: string]: unknown };
export type Res = { setHeader?: (name: string, value: string) => void; [k: string]: unknown };

export function getSessionCookieOptions(_req?: Req): { maxAge: number; path: string; httpOnly: boolean; sameSite: "lax" } {
  return {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  };
}

export function getSessionIdFromCookie(req: Req): string | null {
  const cookie = req?.headers?.cookie ?? "";
  const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? match[1].trim() : null;
}
