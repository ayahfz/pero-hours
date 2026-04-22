import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../../server/routers";

export const trpc = createTRPCReact<AppRouter>();

// ✅ Client setup with your Railway URL
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "https://cheerful-consideration-production-86c4.up.railway.app/api/trpc",
    }),
  ],
});