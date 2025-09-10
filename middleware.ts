import { NextRequest } from 'next/server';
import { createI18nMiddleware } from 'next-international/middleware';

import { auth } from '@/lib/auth';

const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'fr', 'zh'],
  defaultLocale: 'en',
});

export default auth((request: NextRequest) => {
  // API路由不需要国际化处理
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return;
  }

  return I18nMiddleware(request);
});

export const config = {
  matcher: ['/', '/((?!static|.*\\..*|_next|favicon.ico|robots.txt).*)'],
};
