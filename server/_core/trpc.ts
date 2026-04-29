import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";
import { UNAUTHED_ERR_MSG, NOT_ADMIN_ERR_MSG } from "@shared/const";
import superjson from "superjson";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const requireUser = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const protectedProcedure = t.procedure.use(requireUser);

export const pluginProcedure = t.procedure.use(async ({ ctx, next }) => {
  const apiKey = ctx.req.headers["x-api-key"];
  if (apiKey && typeof apiKey === "string") {
    const { getMerchantByApiKey } = await import("../db");
    const merchant = await getMerchantByApiKey(apiKey);
    if (merchant) {
      return next({ ctx: { ...ctx, merchant } });
    }
  }

  if (ctx.user) {
    const { getMerchantByUserId } = await import("../db");
    const merchant = await getMerchantByUserId(ctx.user.id);
    if (merchant) {
      return next({ ctx: { ...ctx, merchant } });
    }
  }

  throw new TRPCError({
    code: "UNAUTHORIZED",
    message: "Valid API Key or Session required",
  });
});

export const adminProcedure = t.procedure.use(requireUser).use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
  }
  return next({ ctx });
});
