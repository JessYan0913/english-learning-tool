"use client"
import { useState } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem(
      "user",
      JSON.stringify({
        email: formData.email,
        name: formData.email.split("@")[0],
        loginTime: new Date().toISOString(),
      }),
    )
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-4xl font-bold">登录</CardTitle>
            <CardDescription className="text-lg">继续你的英语学习之旅</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="邮箱地址"
                  className="h-12 text-lg"
                />
              </div>

              <div>
                <Input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="密码"
                  className="h-12 text-lg"
                />
              </div>

              <Button type="submit" className="w-full h-12 text-lg" size="lg">
                登录
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                还没有账号？{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">
                  立即注册
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
