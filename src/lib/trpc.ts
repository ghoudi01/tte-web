import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@server/routers/index.ts";

export const trpc = createTRPCReact<AppRouter>();
