"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SyntheticV0PageForDeployment() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the home page
    router.push("/")
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p>正在重定向...</p>
    </div>
  )
}
