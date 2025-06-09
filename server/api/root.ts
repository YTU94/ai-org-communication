import { createTRPCRouter } from "./trpc"
import { authRouter } from "./routers/auth"
import { organizationRouter } from "./routers/organization"
import { aiRouter } from "./routers/ai"

export const appRouter = createTRPCRouter({
  auth: authRouter,
  organization: organizationRouter,
  ai: aiRouter,
})

export type AppRouter = typeof appRouter
