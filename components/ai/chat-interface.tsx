"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "../../lib/trpc"

interface ChatInterfaceProps {
  organizationId: string
}

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export function ChatInterface({ organizationId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const chatMutation = api.ai.chat.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "_ai",
          content: data.message,
          isUser: false,
          timestamp: data.timestamp,
        },
      ])
      setIsLoading(false)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    await chatMutation.mutateAsync({
      message: input,
      organizationId,
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AI 组织架构优化助手</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-500">
                <p>您好！我是AI助手，可以帮助您优化组织架构。</p>
                <p>请告诉我您想了解什么或需要什么建议。</p>
              </div>
            )}
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`
                    max-w-xs lg:max-w-md px-4 py-2 rounded-lg
                    ${message.isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}
                  `}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                  <p className="text-sm">AI正在思考中...</p>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="请输入您的问题或需求..."
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              发送
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
