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
    async redirect({ url, baseUrl }) {
      // Redirect to the homepage after successful login
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      // 处理国际化路由，移除语言前缀来获取实际路径
      const pathname = nextUrl.pathname;
      const localeRegex = /^\/(en|ja|zh)(\/.*)?$/;
      const match = pathname.match(localeRegex);
      const actualPath = match ? match[2] || '/' : pathname;

      // 判断当前页面类型
      const isOnHome = actualPath === '/';
      const isOnLogin = actualPath.startsWith('/login');
      const isOnRegister = actualPath.startsWith('/register');

      // 公开页面：仅首页、登录页、注册页
      const isPublicPage = isOnHome || isOnLogin || isOnRegister;

      // 如果已登录用户访问登录或注册页面，重定向到首页
      if (isLoggedIn && (isOnLogin || isOnRegister)) {
        return Response.redirect(new URL('/', nextUrl as unknown as URL));
      }

      // 公开页面允许访问
      if (isPublicPage) {
        return true;
      }

      // 其他页面需要登录
      if (!isLoggedIn) {
        return false; // 这会重定向到登录页面
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
