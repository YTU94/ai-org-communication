"use client"

import type { GetServerSideProps } from "next"
import { getServerSession } from "next-auth/next"
import { useRouter } from "next/router"
import Link from "next/link"
import { authOptions } from "../../lib/auth"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrgChart } from "../../components/organization/org-chart"
import { SearchInterface } from "../../components/ai/search-interface"
import { api } from "../../lib/trpc"

export default function OrganizationDetail() {
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
              <h1 className="text-3xl font-bold text-gray-900">{organization.name}</h1>
              <p className="text-gray-600">{organization.description}</p>
            </div>
            <div className="flex space-x-2">
              <Link href={`/organization/${id}/chat`}>
                <Button>AI助手</Button>
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
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chart">组织架构图</TabsTrigger>
              <TabsTrigger value="search">智能搜索</TabsTrigger>
            </TabsList>

            <TabsContent value="chart" className="mt-6">
              <OrgChart employees={organization.employees} />
            </TabsContent>

            <TabsContent value="search" className="mt-6">
              <SearchInterface organizationId={id} />
            </TabsContent>
          </Tabs>
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
