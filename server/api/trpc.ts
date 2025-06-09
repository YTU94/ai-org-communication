import { initTRPC, TRPCError } from "@trpc/server"
import type { CreateNextContextOptions } from "@trpc/server/adapters/next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../lib/auth"
import superjson from "superjson"

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts
  const session = await getServerSession(req, res, authOptions)

  return {
    session,
    req,
    res,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})
