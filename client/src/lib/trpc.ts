import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../../server/routers";

// ✅ ضيف <AppRouter> هنا
export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "https://cheerful-consideration-production-86c4.up.railway.app/api/trpc",
    }),
  ],
});