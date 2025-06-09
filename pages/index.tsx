import type { GetServerSideProps } from "next"
import { getServerSession } from "next-auth/next"
import Link from "next/link"
import { authOptions } from "../lib/auth"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            AI 企业组织架构
            <span className="text-blue-600">通讯录增强平台</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl">
            利用人工智能技术，帮助企业优化组织架构，提升协作效率。 支持可视化展示、智能搜索和聊天式优化建议。
          </p>

          <div className="flex space-x-4">
            <Link href="/auth/signin">
              <Button size="lg" className="px-8 py-3">
                开始使用
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="px-8 py-3">
                进入控制台
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">智能上传</h3>
              <p className="text-gray-600">支持CSV文件上传，自动解析组织架构信息</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">可视化展示</h3>
              <p className="text-gray-600">直观的组织架构图，清晰展示层级关系</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">AI智能助手</h3>
              <p className="text-gray-600">聊天式优化建议，智能搜索人员和职责</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
