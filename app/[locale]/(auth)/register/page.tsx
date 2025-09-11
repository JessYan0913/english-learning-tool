'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: '密码不匹配',
        description: '请确保两次输入的密码相同',
        variant: 'destructive',
      });
      return;
    }
    localStorage.setItem(
      'user',
      JSON.stringify({
        name: formData.name,
        email: formData.email,
        registerTime: new Date().toISOString(),
      })
    );
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-4xl font-bold">注册</CardTitle>
            <CardDescription className="text-lg">开始你的英语学习之旅</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="姓名"
                  className="h-12 text-lg"
                />
              </div>

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
                  placeholder="设置密码"
                  className="h-12 text-lg"
                />
              </div>

              <div>
                <Input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="确认密码"
                  className="h-12 text-lg"
                />
              </div>

              <Button type="submit" className="w-full h-12 text-lg" size="lg">
                注册
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                已有账号？{' '}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  立即登录
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
