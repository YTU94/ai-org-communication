"use client"

import type { GetServerSideProps } from "next"
import { getServerSession } from "next-auth/next"
import { useRouter } from "next/router"
import Link from "next/link"
import { authOptions } from "../../../lib/auth"
import { Button } from "@/components/ui/button"
import { ChatInterface } from "../../../components/ai/chat-interface"
import { api } from "../../../lib/trpc"

export default function OrganizationChat() {
  const router = useRouter()
  const { id } = router.query as { id: string }

  const { data: organization, isLoading } = api.organization.getById.useQuery({ id }, { enabled: !!id })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>加载中...</p>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>组织不存在</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI 助手 - {organization.name}</h1>
              <p className="text-gray-600">与AI助手聊天，优化您的组织架构</p>
            </div>
            <div className="flex space-x-2">
              <Link href={`/organization/${id}`}>
                <Button variant="outline">返回组织</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">返回首页</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <ChatInterface organizationId={id} />
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
