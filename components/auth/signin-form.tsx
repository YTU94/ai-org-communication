"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, isSignUp: boolean) => {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string

    try {
      const result = await signIn("credentials", {
        email,
        password,
        name,
        isSignUp: isSignUp.toString(),
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      setError("登录失败，请重试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>AI 组织架构平台</CardTitle>
          <CardDescription>登录或注册您的账户</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">登录</TabsTrigger>
              <TabsTrigger value="signup">注册</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">邮箱</Label>
                  <Input id="signin-email" name="email" type="email" required placeholder="请输入邮箱" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">密码</Label>
                  <Input id="signin-password" name="password" type="password" required placeholder="请输入密码" />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "登录中..." : "登录"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">姓名</Label>
                  <Input id="signup-name" name="name" type="text" required placeholder="请输入姓名" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">邮箱</Label>
                  <Input id="signup-email" name="email" type="email" required placeholder="请输入邮箱" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">密码</Label>
                  <Input id="signup-password" name="password" type="password" required placeholder="请输入密码" />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "注册中..." : "注册"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
