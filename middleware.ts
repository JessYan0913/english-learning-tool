import { NextRequest, NextResponse } from 'next/server';
import { createI18nMiddleware } from 'next-international/middleware';
import { auth } from '@/lib/auth';
import type { Session } from 'next-auth';

const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'ja', 'zh'],
  defaultLocale: 'en',
});

export default auth(async (request: NextRequest & { auth: Session | null }) => {
  const { pathname } = request.nextUrl;

  // 跳过 API 路由和静态资源
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    /\.(svg|png|jpg|jpeg|gif|webp|ico)$/.test(pathname)
  ) {
    return I18nMiddleware(request);
  }

  // 获取当前会话
  const session = request.auth;

  console.log('🔐 Middleware Debug:', {
    pathname,
    session: session ? 'exists' : 'null',
    user: session?.user ? 'exists' : 'null'
  });

  // 处理国际化路由，移除语言前缀来获取实际路径
  const localeRegex = /^\/(en|ja|zh)(\/.*)?$/;
  const match = pathname.match(localeRegex);
  const actualPath = match ? match[2] || '/' : pathname;

  console.log('🌍 Middleware Route Debug:', {
    pathname,
    actualPath,
    match: match ? [match[0], match[1], match[2]] : null
  });

  // 判断页面类型
  const isOnHome = actualPath === '/';
  const isOnLogin = actualPath.startsWith('/login');
  const isOnRegister = actualPath.startsWith('/register');

  // 公开页面：首页、登录页、注册页
  const isPublicPage = isOnHome || isOnLogin || isOnRegister;

  console.log('📄 Middleware Page Type Debug:', {
    actualPath,
    isOnHome,
    isOnLogin,
    isOnRegister,
    isPublicPage,
    sessionExists: !!session?.user
  });

  // 如果已登录用户访问登录或注册页面，重定向到首页
  if (session?.user && (isOnLogin || isOnRegister)) {
    console.log('🔄 Redirecting logged-in user from auth page');
    const redirectUrl = new URL('/', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // 公开页面允许访问
  if (isPublicPage) {
    console.log('✅ Allowing access to public page');
    return I18nMiddleware(request);
  }

  // 其他页面需要登录
  if (!session?.user) {
    console.log('❌ Denying access - user not logged in, redirecting to login');
    // 构造登录页面的 URL，包含回调地址
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(loginUrl);
  }

  console.log('✅ Allowing access to protected page');
  return I18nMiddleware(request);
});

export const config = {
  matcher: [
    // 匹配所有路由，但排除静态资源
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
