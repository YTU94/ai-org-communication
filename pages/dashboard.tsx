"use client"

import type { GetServerSideProps } from "next"
import { getServerSession } from "next-auth/next"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { authOptions } from "../lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "../lib/trpc"

export default function Dashboard() {
  const { data: session } = useSession()
  const { data: organizations, isLoading } = api.organization.getAll.useQuery()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">AI 组织架构平台</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">欢迎, {session?.user?.name}</span>
              <Button onClick={() => signOut()} variant="outline">
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>创建新组织</CardTitle>
                <CardDescription>上传组织架构信息，开始使用AI功能</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/upload">
                  <Button className="w-full">上传组织信息</Button>
                </Link>
              </CardContent>
            </Card>

            {isLoading ? (
              <Card>
                <CardContent className="p-6">
                  <p>加载中...</p>
                </CardContent>
              </Card>
            ) : (
              organizations?.map((org) => (
                <Card key={org.id}>
                  <CardHeader>
                    <CardTitle>{org.name}</CardTitle>
                    <CardDescription>{org.description || "暂无描述"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">员工数量: {org.employees.length}</p>
                      <div className="flex space-x-2">
                        <Link href={`/organization/${org.id}`}>
                          <Button size="sm">查看详情</Button>
                        </Link>
                        <Link href={`/organization/${org.id}/chat`}>
                          <Button size="sm" variant="outline">
                            AI助手
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}
