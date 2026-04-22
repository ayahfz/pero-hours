import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../../server/routers";

// ✅ التعديل هنا: إضافة <AppRouter> بين القوسين
export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "https://cheerful-consideration-production-86c4.up.railway.app/api/trpc",
    }),
  ],
});