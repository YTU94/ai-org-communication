import { createTRPCNext } from "@trpc/next"
import type { AppRouter } from "../server/api/root"
import superjson from "superjson"

export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        {
          url: "/api/trpc",
        },
      ],
    }
  },
  ssr: false,
})
