import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnRegister = nextUrl.pathname.includes('/register');
      const isOnLogin = nextUrl.pathname.includes('/login');
      const isPublicPage = isOnRegister || isOnLogin;
      const isApiRoute = nextUrl.pathname.startsWith('/api');
      const isPdfRender =
        /^\/(en|fr|zh)\/pdf-render\//.test(nextUrl.pathname) || nextUrl.pathname.startsWith('/pdf-render/');

      // API路由的认证处理
      if (isApiRoute) {
        if (!isLoggedIn) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        return true;
      }

      // 允许未登录访问用于生成PDF的渲染页面
      if (isPdfRender) {
        return true;
      }

      // 如果已登录且访问登录/注册页面，重定向到首页
      if (isLoggedIn && isPublicPage) {
        return Response.redirect(new URL('/', nextUrl as unknown as URL));
      }

      // 允许访问登录和注册页面
      if (isPublicPage) {
        return true;
      }

      // 对于其他页面，检查登录状态
      if (!isLoggedIn) {
        const loginUrl = new URL('/login', nextUrl.origin);
        // 保存原始URL用于登录后重定向
        loginUrl.searchParams.set('callbackUrl', nextUrl.href);
        return Response.redirect(loginUrl);
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
