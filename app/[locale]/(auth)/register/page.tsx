'use client';

import { useForm } from 'react-hook-form';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormControl, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: FormData) => {
    if (data.password !== data.confirmPassword) {
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
        email: data.email,
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: '请输入邮箱地址',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: '邮箱地址格式不正确',
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="email" placeholder="邮箱地址" className="h-12 text-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  rules={{
                    required: '请设置密码',
                    minLength: {
                      value: 6,
                      message: '密码长度至少6位',
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="password" placeholder="设置密码" className="h-12 text-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  rules={{
                    required: '请确认密码',
                    validate: (value) => value === form.getValues().password || '密码不匹配',
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="password" placeholder="确认密码" className="h-12 text-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full h-12 text-lg" size="lg">
                  注册
                </Button>
              </form>
            </Form>

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
