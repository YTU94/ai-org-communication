// 模拟数据库连接 - 在实际项目中应该使用真实数据库
export interface User {
  id: string
  email: string
  name: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

export interface Employee {
  id: string
  name: string
  position: string
  department: string
  email: string
  phone?: string
  managerId?: string
  level: number
  skills: string[]
  responsibilities: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Organization {
  id: string
  name: string
  description?: string
  userId: string
  employees: Employee[]
  createdAt: Date
  updatedAt: Date
}

// 模拟数据存储
const users: User[] = []
const organizations: Organization[] = []
const employees: Employee[] = []

export const db = {
  user: {
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
      return users.find((u) => u.email === where.email || u.id === where.id) || null
    },
    create: async ({ data }: { data: Omit<User, "id" | "createdAt" | "updatedAt"> }) => {
      const user: User = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      users.push(user)
      return user
    },
  },
  organization: {
    findMany: async ({ where }: { where: { userId: string } }) => {
      return organizations.filter((org) => org.userId === where.userId)
    },
    create: async ({ data }: { data: Omit<Organization, "id" | "createdAt" | "updatedAt"> }) => {
      const org: Organization = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      organizations.push(org)
      return org
    },
    findUnique: async ({ where }: { where: { id: string } }) => {
      return organizations.find((org) => org.id === where.id) || null
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<Organization> }) => {
      const index = organizations.findIndex((org) => org.id === where.id)
      if (index !== -1) {
        organizations[index] = { ...organizations[index], ...data, updatedAt: new Date() }
        return organizations[index]
      }
      return null
    },
  },
  employee: {
    createMany: async ({ data }: { data: Omit<Employee, "id" | "createdAt" | "updatedAt">[] }) => {
      const newEmployees = data.map((emp) => ({
        ...emp,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
      employees.push(...newEmployees)
      return { count: newEmployees.length }
    },
    findMany: async ({ where }: { where?: { organizationId?: string } } = {}) => {
      return employees
    },
  },
}
