import type { Req, Res } from "./cookies";
import { getSessionIdFromCookie } from "./cookies";
import { getSessionBySessionId, getUserById } from "../db";

export type User = {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: "user" | "admin";
};

export type Context = {
  req: Req;
  res: Res;
  user: User | null;
};

function rowToUser(row: { id: number; openId: string; name: string | null; email: string | null; role: "user" | "admin" }): User {
  return { id: row.id, openId: row.openId, name: row.name, email: row.email, role: row.role };
}

export async function createContext(opts: { req: Req; res: Res }): Promise<Context> {
  const { req, res } = opts;
  let user: User | null = (req as { user?: User }).user ?? null;
  if (!user) {
    const sessionId = getSessionIdFromCookie(req);
    if (sessionId) {
      const session = await getSessionBySessionId(sessionId);
      if (session) {
        const row = await getUserById(session.userId);
        if (row) user = rowToUser(row);
      }
      if (!user && typeof globalThis !== "undefined") {
        const getter = (globalThis as unknown as { getUserFromSession?: (id: string) => Promise<User | null> }).getUserFromSession;
        if (getter) user = await getter(sessionId);
      }
    }
  }
  return { req, res, user };
}
