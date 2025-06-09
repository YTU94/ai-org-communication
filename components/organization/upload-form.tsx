"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "../../lib/trpc"

export function UploadForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [csvData, setCsvData] = useState("")
  const router = useRouter()

  const createOrganization = api.organization.create.useMutation({
    onSuccess: () => {
      router.push("/dashboard")
    },
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/csv") {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        setCsvData(text)
      }
      reader.readAsText(file)
    }
  }

  const parseCsvData = (csvText: string) => {
    const lines = csvText.split("\n").filter((line) => line.trim())
    const headers = lines[0].split(",").map((h) => h.trim())

    return lines
      .slice(1)
      .map((line) => {
        const values = line.split(",").map((v) => v.trim())
        const employee: any = {}

        headers.forEach((header, index) => {
          const value = values[index] || ""
          switch (header.toLowerCase()) {
            case "name":
            case "姓名":
              employee.name = value
              break
            case "position":
            case "职位":
              employee.position = value
              break
            case "department":
            case "部门":
              employee.department = value
              break
            case "email":
            case "邮箱":
              employee.email = value
              break
            case "phone":
            case "电话":
              employee.phone = value
              break
            case "level":
            case "级别":
              employee.level = Number.parseInt(value) || 1
              break
            case "skills":
            case "技能":
              employee.skills = value.split(";").filter((s) => s.trim())
              break
            case "responsibilities":
            case "职责":
              employee.responsibilities = value.split(";").filter((r) => r.trim())
              break
          }
        })

        return employee
      })
      .filter((emp) => emp.name && emp.position && emp.department && emp.email)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    try {
      const employees = csvData ? parseCsvData(csvData) : []

      await createOrganization.mutateAsync({
        name,
        description,
        employees,
      })
    } catch (error) {
      console.error("创建组织失败:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>上传组织架构信息</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">组织名称</Label>
            <Input id="name" name="name" required placeholder="请输入组织名称" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">组织描述</Label>
            <Textarea id="description" name="description" placeholder="请输入组织描述（可选）" rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="csv-file">上传CSV文件</Label>
            <Input id="csv-file" type="file" accept=".csv" onChange={handleFileUpload} />
            <p className="text-sm text-gray-500">CSV文件应包含以下列：姓名、职位、部门、邮箱、电话、级别、技能、职责</p>
          </div>

          {csvData && (
            <div className="space-y-2">
              <Label>CSV预览</Label>
              <Textarea
                value={csvData.slice(0, 500) + (csvData.length > 500 ? "..." : "")}
                readOnly
                rows={5}
                className="font-mono text-sm"
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "创建中..." : "创建组织"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
