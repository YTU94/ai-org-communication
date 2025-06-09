import type { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "./db"

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        isSignUp: { label: "Is Sign Up", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null

        if (credentials.isSignUp === "true") {
          // 注册逻辑
          const existingUser = await db.user.findUnique({
            where: { email: credentials.email },
          })

          if (existingUser) {
            throw new Error("用户已存在")
          }

          const user = await db.user.create({
            data: {
              email: credentials.email,
              name: credentials.name || "用户",
            },
          })

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } else {
          // 登录逻辑
          const user = await db.user.findUnique({
            where: { email: credentials.email },
          })

          if (!user) {
            throw new Error("用户不存在")
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}
