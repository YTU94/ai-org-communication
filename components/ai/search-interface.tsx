"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "../../lib/trpc"
import type { Employee } from "../../lib/db"

interface SearchInterfaceProps {
  organizationId: string
}

export function SearchInterface({ organizationId }: SearchInterfaceProps) {
  const [query, setQuery] = useState("")
  const [searchType, setSearchType] = useState<"person" | "responsibility" | "collaboration">("person")
  const [results, setResults] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const searchMutation = api.ai.search.useMutation({
    onSuccess: (data) => {
      setResults(data.results)
      setIsLoading(false)
    },
  })

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    await searchMutation.mutateAsync({
      query,
      organizationId,
      type: searchType,
    })
  }

  const getSearchTypeLabel = (type: string) => {
    switch (type) {
      case "person":
        return "找人"
      case "responsibility":
        return "找职责"
      case "collaboration":
        return "找协作"
      default:
        return "搜索"
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>AI 智能搜索</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4 mb-6">
          <div className="flex space-x-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="请输入搜索内容..."
              className="flex-1"
            />
            <Select value={searchType} onValueChange={(value: any) => setSearchType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="person">找人</SelectItem>
                <SelectItem value="responsibility">找职责</SelectItem>
                <SelectItem value="collaboration">找协作</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" disabled={isLoading || !query.trim()}>
              {isLoading ? "搜索中..." : "搜索"}
            </Button>
          </div>
        </form>

        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">搜索结果 ({results.length} 条)</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {results.map((employee) => (
                <Card key={employee.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">{employee.name}</h4>
                      <p className="text-sm text-gray-600">{employee.position}</p>
                      <p className="text-sm text-gray-500">{employee.department}</p>
                      <p className="text-xs text-gray-400">Level {employee.level}</p>

                      {searchType === "responsibility" && employee.responsibilities.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-700">职责:</p>
                          <ul className="text-xs text-gray-600 list-disc list-inside">
                            {employee.responsibilities.slice(0, 3).map((resp, index) => (
                              <li key={index}>{resp}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {searchType === "collaboration" && employee.skills.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-700">技能:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {employee.skills.slice(0, 3).map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500">{employee.email}</p>
                        {employee.phone && <p className="text-xs text-gray-500">{employee.phone}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {results.length === 0 && searchMutation.data && (
          <div className="text-center text-gray-500 py-8">
            <p>没有找到相关结果</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
