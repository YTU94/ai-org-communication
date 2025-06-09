import { createTRPCRouter, protectedProcedure } from "../trpc"
import { organizationSchema } from "../../../lib/validations"
import { db } from "../../../lib/db"
import { z } from "zod"

export const organizationRouter = createTRPCRouter({
  create: protectedProcedure.input(organizationSchema).mutation(async ({ input, ctx }) => {
    const organization = await db.organization.create({
      data: {
        name: input.name,
        description: input.description,
        userId: ctx.session.user.id,
        employees: [],
      },
    })

    if (input.employees.length > 0) {
      await db.employee.createMany({
        data: input.employees.map((emp) => ({
          ...emp,
          organizationId: organization.id,
        })),
      })

      const employees = await db.employee.findMany()
      const orgEmployees = employees.filter((emp) => input.employees.some((inputEmp) => inputEmp.email === emp.email))

      await db.organization.update({
        where: { id: organization.id },
        data: { employees: orgEmployees },
      })
    }

    return organization
  }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await db.organization.findMany({
      where: { userId: ctx.session.user.id },
    })
  }),

  getById: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    return await db.organization.findUnique({
      where: { id: input.id },
    })
  }),
})
