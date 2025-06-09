import { createTRPCRouter, protectedProcedure } from "../trpc"
import { chatMessageSchema, searchSchema } from "../../../lib/validations"
import { db } from "../../../lib/db"

export const aiRouter = createTRPCRouter({
  chat: protectedProcedure.input(chatMessageSchema).mutation(async ({ input }) => {
    const organization = await db.organization.findUnique({
      where: { id: input.organizationId },
    })

    if (!organization) {
      throw new Error("组织不存在")
    }

    // 模拟AI响应
    const responses = [
      "根据您的组织架构，我建议可以考虑在技术部门下增设一个数据分析小组。",
      "您的管理层级看起来比较扁平，这有利于快速决策和沟通。",
      "建议为销售部门配置更多的支持人员，以提高销售效率。",
      "您的组织架构中缺少专门的人力资源部门，建议考虑设立。",
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    return {
      message: randomResponse,
      timestamp: new Date(),
    }
  }),

  search: protectedProcedure.input(searchSchema).mutation(async ({ input }) => {
    const organization = await db.organization.findUnique({
      where: { id: input.organizationId },
    })

    if (!organization) {
      throw new Error("组织不存在")
    }

    const employees = organization.employees
    let results: any[] = []

    switch (input.type) {
      case "person":
        results = employees.filter(
          (emp) =>
            emp.name.includes(input.query) ||
            emp.position.includes(input.query) ||
            emp.department.includes(input.query),
        )
        break
      case "responsibility":
        results = employees.filter((emp) => emp.responsibilities.some((resp) => resp.includes(input.query)))
        break
      case "collaboration":
        results = employees.filter((emp) => emp.skills.some((skill) => skill.includes(input.query)))
        break
    }

    return {
      results,
      query: input.query,
      type: input.type,
    }
  }),
})
