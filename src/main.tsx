import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from "./constants/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { SESSION_STORAGE_TOKEN_KEY } from "./constants/auth";
import { getLoginUrl } from "./const";
import "./index.css";

const queryClient = new QueryClient();
const resolveTrpcUrl = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!baseUrl) return "/api/trpc";

  const normalizedBase = baseUrl.replace(/\/+$/, "");
  if (normalizedBase.endsWith("/api/trpc")) return normalizedBase;
  if (normalizedBase.endsWith("/api")) return `${normalizedBase}/trpc`;
  return `${normalizedBase}/api/trpc`;
};

const resolvedTrpcUrl = resolveTrpcUrl();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  if (typeof sessionStorage !== "undefined") {
    sessionStorage.removeItem(SESSION_STORAGE_TOKEN_KEY);
  }
  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    redirectToLoginIfUnauthorized(event.query.state.error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    redirectToLoginIfUnauthorized(event.mutation.state.error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: resolvedTrpcUrl,
      transformer: superjson,
      /**
       * Do not use methodOverride: "POST". tRPC rejects POST for `.query()` procedures
       * (e.g. auth.me) with 405 METHOD_NOT_SUPPORTED. Default: GET for queries, POST for
       * mutations. If batched GET URLs hit 414, prefer smaller batches or httpBatchStreamLink.
       */
      fetch(input, init) {
        const headers = new Headers(init?.headers as HeadersInit | undefined);
        if (typeof sessionStorage !== "undefined") {
          const token = sessionStorage.getItem(SESSION_STORAGE_TOKEN_KEY);
          if (token) headers.set("Authorization", `Bearer ${token}`);
        }
        return globalThis.fetch(input, {
          ...(init ?? {}),
          headers,
          credentials: "include",
        });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
