import { z } from "zod"

export const employeeSchema = z.object({
  name: z.string().min(1, "姓名不能为空"),
  position: z.string().min(1, "职位不能为空"),
  department: z.string().min(1, "部门不能为空"),
  email: z.string().email("邮箱格式不正确"),
  phone: z.string().optional(),
  managerId: z.string().optional(),
  level: z.number().min(1).max(10),
  skills: z.array(z.string()),
  responsibilities: z.array(z.string()),
})

export const organizationSchema = z.object({
  name: z.string().min(1, "组织名称不能为空"),
  description: z.string().optional(),
  employees: z.array(employeeSchema),
})

export const chatMessageSchema = z.object({
  message: z.string().min(1, "消息不能为空"),
  organizationId: z.string(),
})

export const searchSchema = z.object({
  query: z.string().min(1, "搜索内容不能为空"),
  organizationId: z.string(),
  type: z.enum(["person", "responsibility", "collaboration"]),
})
